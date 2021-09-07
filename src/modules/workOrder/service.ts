import { addBusinessDays, format } from 'date-fns';
import { Service } from 'typedi';
import { DATE_FORMAT, DEFAULT_LIMIT, ErrorName } from '~const';
import { GetListResponse } from '~interfaces/common';
import { logger } from '~logger';
import ProductService from '~modules/product/service';
import { prisma } from '~prisma';
import { getHasMore } from '~utils/response';
import { getDefaultOrderedAtRange } from '~utils/workOrder';

import {
    PlateStatus, PrintSide, Prisma, Stock, StockHistoryType, WorkOrder, WorkOrderStatus
} from '@prisma/client';

import {
    FailedWorkOrderCreationAttributes, GetWorkOrderCountQueryParams,
    GetWorkOrdersByDeadlineQueryParams, GetWorkOrdersQueryParams, WorkOrderCompleteInput,
    WorkOrderCount, WorkOrderCreateInput, WorkOrdersByDeadline, WorkOrdersCreateInput,
    WorkOrdersCreationResponse, WorkOrderUpdateInput
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

  public async getAllWorkOrders(query: GetWorkOrdersQueryParams): Promise<GetListResponse<WorkOrder>> {
    const where = this.generateWhereClause(query);

    const rows = await prisma.workOrder.findMany({
      where,
      include: this.baseInclude,
      orderBy: { id: 'asc' },
    });

    return { rows };
  }

  public async getWorkOrdersByDeadline(query: GetWorkOrdersByDeadlineQueryParams): Promise<WorkOrdersByDeadline> {
    const deadline = query.deadline || format(new Date(), DATE_FORMAT);

    const [overdue, imminent] = await Promise.all([
      await prisma.workOrder.findMany({
        where: {
          deliverBy: {
            lt: new Date(deadline),
          },
          completedAt: {
            equals: null,
          },
        },
        include: this.baseInclude,
        orderBy: [{ deliverBy: 'asc' }, { orderedAt: 'asc' }],
      }),
      await prisma.workOrder.findMany({
        where: {
          deliverBy: {
            gte: new Date(deadline),
            lte: addBusinessDays(new Date(deadline), 3),
          },
          completedAt: {
            equals: null,
          },
        },
        include: this.baseInclude,
        orderBy: [{ deliverBy: 'asc' }, { orderedAt: 'asc' }],
      }),
    ]);

    return { overdue, imminent };
  }

  public async getWorkOrdersNeedPlate(): Promise<WorkOrder[]> {
    return await prisma.workOrder.findMany({
      where: {
        plateStatus: {
          not: PlateStatus.CONFIRM,
        },
        isPlateReady: {
          equals: false,
        },
        completedAt: {
          equals: null,
        },
      },
      include: this.baseInclude,
      orderBy: { id: 'asc' },
    });
  }

  public async getWorkOrdersByProductId(productId: number): Promise<WorkOrder[]> {
    return await prisma.workOrder.findMany({
      where: { productId },
      include: this.baseInclude,
      orderBy: { id: 'desc' },
    });
  }

  public async getWorkOrderCount({ orderedAt }: GetWorkOrderCountQueryParams): Promise<WorkOrderCount> {
    let where: Prisma.WorkOrderWhereInput = {};
    if (!!orderedAt && orderedAt.length >= 2) {
      where = {
        orderedAt: {
          gte: orderedAt[0],
          lte: orderedAt[1],
        },
      };
    }

    const [NOT_STARTED, EXTRUDING, PRINTING, CUTTING, COMPLETED, NONE, SINGLE, DOUBLE] = await Promise.all([
      await prisma.workOrder.count({ where: { ...where, workOrderStatus: { equals: WorkOrderStatus.NOT_STARTED } } }),
      await prisma.workOrder.count({ where: { ...where, workOrderStatus: { equals: WorkOrderStatus.EXTRUDING } } }),
      await prisma.workOrder.count({ where: { ...where, workOrderStatus: { equals: WorkOrderStatus.PRINTING } } }),
      await prisma.workOrder.count({ where: { ...where, workOrderStatus: { equals: WorkOrderStatus.CUTTING } } }),
      await prisma.workOrder.count({ where: { ...where, workOrderStatus: { equals: WorkOrderStatus.COMPLETED } } }),
      await prisma.workOrder.count({ where: { ...where, product: { printSide: { equals: PrintSide.NONE } } } }),
      await prisma.workOrder.count({ where: { ...where, product: { printSide: { equals: PrintSide.SINGLE } } } }),
      await prisma.workOrder.count({ where: { ...where, product: { printSide: { equals: PrintSide.DOUBLE } } } }),
    ]);

    return {
      byStatus: { NOT_STARTED, EXTRUDING, PRINTING, CUTTING, COMPLETED },
      byPrintSide: { NONE, SINGLE, DOUBLE },
    };
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
          await prisma.workOrder.create({
            data: { accountId: product.accountId, productId: product.id, ...restWorkOrder },
            include: this.baseInclude,
          });
          createdCount++;
        } catch (error) {
          failedList.push({ ...workOrder, reason: error.message as string });
        }
      })
    );

    return { createdCount, failedList };
  }

  public async updateWorkOrder(
    id: string,
    { orderUpdatedAt, ...userInput }: WorkOrderUpdateInput
  ): Promise<WorkOrder | null> {
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

  public async completeWorkOrders(workOrders: WorkOrderCompleteInput[]): Promise<WorkOrder[]> {
    return await Promise.all(
      workOrders.map(async ({ id, completedQuantity = 0, completedAt, workOrderStatus, productId }) => {
        const workOrder = await prisma.workOrder.findUnique({ where: { id } });
        let stock = await prisma.stock.findFirst({ where: { productId } });
        const quantity = completedQuantity - (workOrder?.completedQuantity || 0);

        if (quantity !== 0) {
          if (!stock) {
            stock = await prisma.stock.create({
              data: {
                balance: 0,
                product: { connect: { id: productId } },
                history: {
                  create: {
                    type: StockHistoryType.CREATED,
                    quantity: 0,
                    balance: 0,
                  },
                },
              },
            });
          }

          const lastStockHistory = await prisma.stockHistory.findFirst({
            where: { stockId: stock?.id },
            orderBy: { createdAt: 'desc' },
          });
          const balance = lastStockHistory!.balance + quantity;

          await prisma.stock.update({
            where: { id: stock.id },
            data: {
              balance,
              history: {
                create: {
                  type: StockHistoryType.MANUFACTURED,
                  quantity,
                  balance,
                },
              },
            },
          });
        }

        return await prisma.workOrder.update({
          where: { id },
          data: { completedAt, completedQuantity, workOrderStatus },
          include: this.baseInclude,
        });
      })
    );
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
          mode: Prisma.QueryMode.insensitive,
        },
      },
      product: {
        name: {
          contains: productName,
          mode: Prisma.QueryMode.insensitive,
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
        images: true,
      },
    },
  };
}
