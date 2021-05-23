import { Service } from 'typedi';
import { prisma } from '~prisma';

import { Stock, StockHistoryType } from '@prisma/client';

import { StockCreateOrUpdateInput } from './interface';

@Service()
export default class StockService {
  public async createOrUpdateStocks(stocks: StockCreateOrUpdateInput[]): Promise<Stock[]> {
    return await Promise.all(
      stocks.map(async (stock) => {
        const lastHistory =
          stock.id &&
          (await prisma.stockHistory.findFirst({
            where: { stockId: stock.id },
            orderBy: { createdAt: 'desc' },
          }));

        // Update
        if (lastHistory) {
          // No Change
          if (lastHistory.balance === stock.balance) {
            return (await prisma.stock.findUnique({ where: { id: stock.id } })) as Stock;
          }

          const { id, ...changes } = stock;
          return await prisma.stock.update({
            where: { id: stock.id },
            data: {
              ...changes,
              history: {
                create: {
                  type: StockHistoryType.STOCKTAKING,
                  quantity: changes.balance - lastHistory.quantity,
                  balance: changes.balance,
                },
              },
            },
            include: {
              history: true,
            },
          });
        }

        // Create
        return await prisma.stock.create({
          data: {
            ...stock,
            history: {
              create: {
                type: StockHistoryType.CREATED,
                quantity: stock.balance,
                balance: stock.balance,
              },
            },
          },
          include: { history: true },
        });
      })
    );
  }
}
