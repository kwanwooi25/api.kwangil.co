import { Prisma, WorkOrder } from '@prisma/client';
import { format } from 'date-fns';
import { Service } from 'typedi';
import { DEFAULT_LIMIT, ErrorName } from '~const';
import { GetListResponse } from '~interfaces/common';
import { logger } from '~logger';
import ProductService from '~modules/product/service';
import { prisma } from '~prisma';
import { getHasMore } from '~utils/response';
import { getDefaultOrderedAtRange } from '~utils/workOrder';
import {
  WorkOrderCreateInput,
  GetWorkOrdersQueryParams,
  WorkOrdersCreateInput,
  WorkOrdersCreationResponse,
  FailedWorkOrderCreationAttributes,
  WorkOrderUpdateInput,
} from './interface';

@Service()
export default class WorkOrderService {
  constructor(private productService: ProductService) {}

  public async getWorkOrderById(id: string) {
    logger.debug('... Looking for workOrder: %o', id);
    return prisma.workOrder.findUnique({ where: { id }, include: this.baseInclude });
  }

  public async getWorkOrders(query: GetWorkOrdersQueryParams): Promise<GetListResponse<WorkOrder>> {
    const { offset = 0, limit = DEFAULT_LIMIT } = query;

    const where = this.generateWhereClause(query);

    const [count, rows] = await Promise.all([
      prisma.workOrder.count({ where }),
      prisma.workOrder.findMany({
        skip: offset,
        take: limit,
        where,
        include: this.baseInclude,
        orderBy: {
          id: 'asc',
        },
      }),
    ]);

    const hasMore = getHasMore({ limit, offset, count });

    return { count, rows, hasMore };
  }

  public async createWorkOrder(userInput: WorkOrderCreateInput): Promise<WorkOrder | void> {
    try {
      const id = await this.generateWorkOrderId(userInput);
      logger.debug('... Generated WorkOrder ID: %o', id);

      const createdWorkOrder = await prisma
        .$transaction([
          prisma.workOrder.create({
            data: { id, ...userInput },
            include: this.baseInclude,
          }),
        ])
        .then(([workOrder]) => {
          logger.debug('... Created WorkOrder for product: %o', userInput.productId);
          return workOrder;
        })
        .catch(async (reason) => {
          const id = await this.rollbackWorkOrderId(userInput);
          logger.debug('... Rollback WorkOrder ID: %o', id);
          throw new Error(reason);
        });

      return createdWorkOrder;
    } catch (error) {
      throw error;
    }
  }

  public async createWorkOrders(userInput: WorkOrdersCreateInput[]): Promise<WorkOrdersCreationResponse> {
    let failedList: FailedWorkOrderCreationAttributes[] = [];
    let createdCount = 0;

    await Promise.all(
      userInput.map(async (workOrder) => {
        try {
          const { accountName, productName: name, thickness, length, width, ...restWorkOrder } = workOrder;
          const product = await this.productService.getProduct({ accountName, name, thickness, length, width });
          if (!product || !product.accountId) {
            throw new Error('Product not found');
          }
          await this.createWorkOrder({ accountId: product.accountId, productId: product.id, ...restWorkOrder });
          createdCount++;
        } catch (error) {
          failedList.push({ ...workOrder, reason: error.message as string });
        }
      })
    );

    return { createdCount, failedList };
  }

  public async updateWorkOrder(id: string, userInput: WorkOrderUpdateInput): Promise<WorkOrder | null> {
    const workOrderToUpdate = await this.getWorkOrderById(id);
    if (!workOrderToUpdate) {
      throw new Error(ErrorName.WORK_ORDER_NOT_FOUND);
    }

    try {
      logger.debug('... Updating the workOrder %o', id);
      return await prisma.workOrder.update({
        where: { id },
        data: userInput,
        include: this.baseInclude,
      });
    } catch (error) {
      throw error;
    }
  }

  public async deleteWorkOrders(ids: string[]): Promise<number> {
    const { count } = await prisma.workOrder.deleteMany({ where: { id: { in: ids } } });
    return count;
  }

  private async generateWorkOrderId({ id, orderedAt = '' }: WorkOrderCreateInput): Promise<string> {
    const workOrderSeqId = format(new Date(orderedAt), 'yyyy-MM');

    if (!id) {
      const workOrderSeq = await prisma.workOrderSeq.upsert({
        where: { id: workOrderSeqId },
        create: { id: workOrderSeqId, seq: 1 },
        update: { id: workOrderSeqId, seq: { increment: 1 } },
      });

      const seq = `${workOrderSeq.seq}`.padStart(3, '0');

      return `${workOrderSeq.id}-${seq}`;
    } else {
      const workOrderSeqValue = +(id.split('-').pop() || 1);
      const workOrderSeq = await prisma.workOrderSeq.findUnique({ where: { id: workOrderSeqId } });

      if (!workOrderSeq) {
        await prisma.workOrderSeq.create({ data: { id: workOrderSeqId, seq: 1 } });
      } else if (workOrderSeq.seq < workOrderSeqValue) {
        await prisma.workOrderSeq.update({ where: { id: workOrderSeqId }, data: { seq: workOrderSeqValue } });
      }

      return id;
    }
  }

  private async rollbackWorkOrderId({ orderedAt = '' }: WorkOrderCreateInput): Promise<string> {
    const workOrderSeqId = format(new Date(orderedAt), 'yyyy-MM');
    const workOrderSeq = await prisma.workOrderSeq.update({
      where: { id: workOrderSeqId },
      data: { seq: { decrement: 1 } },
    });

    const seq = `${workOrderSeq.seq}`.padStart(3, '0');

    return `${workOrderSeq.id}-${seq}`;
  }

  private generateWhereClause(query: GetWorkOrdersQueryParams) {
    const {
      orderedAt = getDefaultOrderedAtRange(),
      accountName = '',
      productName = '',
      includeCompleted = false,
    } = query;
    let where: Prisma.WorkOrderWhereInput = {
      orderedAt: {
        gte: orderedAt[0],
        lte: orderedAt[1],
      },
      account: {
        name: {
          contains: accountName,
        },
      },
      product: {
        name: {
          contains: productName,
        },
      },
    };

    if (!includeCompleted) {
      where.completedAt = null;
    }

    return where;
  }

  private baseInclude: Prisma.WorkOrderInclude = {
    product: {
      include: {
        account: true,
      },
    },
  };
}
