import { Plate, Prisma } from '@prisma/client';
import { Service } from 'typedi';
import { DEFAULT_LIMIT, ErrorName, PlateLength, PlateRound } from '~const';
import { GetListResponse } from '~interfaces/common';
import { logger } from '~logger';
import { prisma } from '~prisma';
import { getHasMore } from '~utils/response';
import { GetPlatesQueryParams, PlateCreateInput, PlateUpdateInput } from './interface';

@Service()
export default class PlateService {
  public async getPlateById(id: number): Promise<Plate | null> {
    logger.debug('... Looking for plate: %o', id);
    return prisma.plate.findUnique({
      where: { id },
      include: this.baseInclude,
    });
  }

  public async getPlates(query: GetPlatesQueryParams): Promise<GetListResponse<Plate>> {
    const { offset = 0, limit = DEFAULT_LIMIT } = query;

    const where = this.generateWhereClause(query);

    const [count, rows] = await Promise.all([
      prisma.plate.count({ where }),
      prisma.plate.findMany({
        skip: offset,
        take: limit,
        where,
        orderBy: [{ round: 'asc' }, { length: 'asc' }, { name: 'asc' }],
        include: this.baseInclude,
      }),
    ]);

    const hasMore = getHasMore({ limit, offset, count });

    return { count, rows, hasMore };
  }

  public async createPlate({ products, ...plate }: PlateCreateInput): Promise<Plate | null> {
    try {
      logger.debug('... Creating plate');
      return await prisma.plate.create({
        data: {
          ...plate,
          products: {
            connect: products.map(({ id }) => ({ id })),
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async updatePlate(id: number, userInput: PlateUpdateInput) {
    const plateToUpdate = await this.getPlateById(id);
    if (!plateToUpdate) {
      throw new Error(ErrorName.PLATE_NOT_FOUND);
    }

    try {
      const { products, productsToDisconnect, ...restUserInput } = userInput;

      logger.debug('... Updating the plate %o', id);
      return await prisma.plate.update({
        where: { id },
        data: {
          ...restUserInput,
          products: {
            connect: products.map(({ id }) => ({ id })),
            disconnect: productsToDisconnect.map(({ id }) => ({ id })),
          },
        },
        include: this.baseInclude,
      });
    } catch (error) {
      throw error;
    }
  }

  public async deletePlates(ids: number[]): Promise<number> {
    const { count } = await prisma.plate.deleteMany({ where: { id: { in: ids } } });
    return count;
  }

  private generateWhereClause(query: GetPlatesQueryParams): Prisma.PlateWhereInput {
    const [minRound, maxRound] = query.round || [PlateRound.MIN, PlateRound.MAX];
    const [minLength, maxLength] = query.length || [PlateLength.MIN, PlateLength.MAX];

    let relationWhere: Prisma.PlateWhereInput[] = [
      {
        products: {
          some: {
            AND: [
              {
                account: {
                  name: {
                    contains: query.accountName,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                name: {
                  contains: query.productName,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          },
        },
      },
    ];

    if (!query.accountName && !query.productName) {
      relationWhere.push({
        products: {
          none: {},
        },
      });
    }

    return {
      AND: {
        round: {
          gte: minRound,
          lte: maxRound,
        },
        length: {
          gte: minLength,
          lte: maxLength,
        },
        name: {
          contains: query.name,
          mode: Prisma.QueryMode.insensitive,
        },
        OR: relationWhere,
      },
    };
  }

  private baseInclude: Prisma.PlateInclude = {
    products: {
      select: {
        id: true,
        name: true,
        thickness: true,
        length: true,
        width: true,
        account: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { account: { name: 'asc' } },
        { name: 'asc' },
        { thickness: 'asc' },
        { length: 'asc' },
        { width: 'asc' },
      ],
    },
  };
}
