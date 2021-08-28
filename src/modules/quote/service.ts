import { Service } from 'typedi';
import { DEFAULT_LIMIT } from '~const';
import { GetListResponse } from '~interfaces/common';
import { logger } from '~logger';
import { prisma } from '~prisma';
import { getHasMore } from '~utils/response';

import { Prisma, Quote } from '@prisma/client';

import { GetQuotesQueryParams } from './interface';

@Service()
export default class QuoteService {
  public async getQuoteById(id: number): Promise<Quote | null> {
    logger.debug('... Looking for quote: %o', id);
    return await prisma.quote.findUnique({
      where: { id },
      include: { account: true },
    });
  }

  public async getQuotes(query: GetQuotesQueryParams): Promise<GetListResponse<Quote>> {
    const { offset = 0, limit = DEFAULT_LIMIT } = query;

    const [count, rows] = await Promise.all([
      prisma.quote.count(),
      prisma.quote.findMany({
        skip: offset,
        take: limit,
        orderBy: this.defaultOrderBy,
        include: this.defaultInclude,
      }),
    ]);

    const hasMore = getHasMore({ limit, offset, count });

    return { rows, count, hasMore };
  }

  public async getAllQuotes(query: GetQuotesQueryParams): Promise<GetListResponse<Quote>> {
    const rows = await prisma.quote.findMany({
      orderBy: this.defaultOrderBy,
      include: this.defaultInclude,
    });

    return { rows };
  }

  public async createQuote(userInput: Prisma.QuoteUncheckedCreateInput): Promise<Quote | null> {
    try {
      logger.debug('... Creating Quote for %o', userInput.accountId);
      return await prisma.quote.create({
        data: userInput,
        include: this.defaultInclude,
      });
    } catch (error) {
      throw error;
    }
  }

  private defaultOrderBy: Prisma.QuoteOrderByInput[] = [
    { createdAt: 'desc' },
    { productName: 'asc' },
    { thickness: 'asc' },
    { length: 'asc' },
    { width: 'asc' },
  ];
  private defaultInclude: Prisma.QuoteInclude = { account: true };
}
