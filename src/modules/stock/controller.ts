import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { HttpStatus } from '~const';

import StockService from './service';

export const createOrUpdateStocks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stocks = await Container.get(StockService).createOrUpdateStocks(req.body);
    return res.status(HttpStatus.OK).json(stocks);
  } catch (error) {
    next(error);
  }
};
