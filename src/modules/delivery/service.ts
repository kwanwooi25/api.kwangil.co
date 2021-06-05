import { Service } from 'typedi';
import { DEFAULT_LIMIT } from '~const';
import { GetListResponse } from '~interfaces/common';
import { prisma } from '~prisma';
import { getHasMore } from '~utils/response';

import { Delivery, Prisma } from '@prisma/client';

import { GetDeliveriesQueryParams } from './interface';

@Service()
export default class DeliveryService {
  public async getDeliveries(query: GetDeliveriesQueryParams): Promise<GetListResponse<Delivery>> {
    const { offset = 0, limit = DEFAULT_LIMIT, date, method } = query;
    const where: Prisma.DeliveryWhereInput = {
      date,
      method,
    };

    const [count, rows] = await Promise.all([
      prisma.delivery.count({ where }),
      prisma.delivery.findMany({
        skip: offset,
        take: limit,
        where,
        include: {
          product: {
            include: {
              account: true,
              stock: true,
              images: true,
            },
          },
          workOrder: true,
        },
        orderBy: [
          { product: { account: { name: 'asc' } } },
          { product: { name: 'asc' } },
          { product: { thickness: 'asc' } },
          { product: { length: 'asc' } },
          { product: { width: 'asc' } },
        ],
      }),
    ]);

    const hasMore = getHasMore({ limit, offset, count });

    return { count, rows, hasMore };
  }

  public async createDeliveries(
    deliveriesToCreate: Prisma.DeliveryUncheckedCreateInput[]
  ): Promise<Prisma.BatchPayload> {
    return await prisma.delivery.createMany({ data: deliveriesToCreate });
  }
}
