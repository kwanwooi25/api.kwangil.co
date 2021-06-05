import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { HttpStatus } from '~const';

import DeliveryService from './service';

export const getDeliveries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(DeliveryService).getDeliveries(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const createDeliveries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { count } = await Container.get(DeliveryService).createDeliveries(req.body);
    res.status(HttpStatus.CREATED).json(count);
  } catch (error) {
    next(error);
  }
};
