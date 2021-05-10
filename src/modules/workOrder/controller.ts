import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { HttpStatus } from '~const';

import { WorkOrderUpdateInput } from './interface';
import WorkOrderService from './service';

export const getWorkOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workOrder = await Container.get(WorkOrderService).getWorkOrderById(req.params.id);
    return res.status(HttpStatus.OK).json(workOrder);
  } catch (error) {
    next(error);
  }
};

export const getWorkOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(WorkOrderService).getWorkOrders(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const getWorkOrdersByDeadline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(WorkOrderService).getWorkOrdersByDeadline(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const getWorkOrderCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(WorkOrderService).getWorkOrderCount(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAllWorkOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(WorkOrderService).getAllWorkOrders(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const createWorkOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdWorkOrder = await Container.get(WorkOrderService).createWorkOrder(req.body);
    res.status(HttpStatus.CREATED).json(createdWorkOrder);
  } catch (error) {
    next(error);
  }
};

export const createWorkOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(WorkOrderService).createWorkOrders(req.body);
    const status =
      data.createdCount <= 0
        ? HttpStatus.INTERNAL_SERVER_ERROR
        : data.failedList.length
        ? HttpStatus.ACCEPTED
        : HttpStatus.CREATED;
    return res.status(status).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateWorkOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedWorkOrder = await Container.get(WorkOrderService).updateWorkOrder(req.params.id, req.body);
    return res.status(HttpStatus.OK).json(updatedWorkOrder);
  } catch (error) {
    next(error);
  }
};

export const updateWorkOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workOrdersToUpdate: WorkOrderUpdateInput[] = req.body || [];
    const updatedWorkOrders = await Promise.all(
      workOrdersToUpdate.map(
        async ({ id, ...workOrder }) => await Container.get(WorkOrderService).updateWorkOrder(id as string, workOrder)
      )
    );
    return res.status(HttpStatus.OK).json(updatedWorkOrders);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedCount = await Container.get(WorkOrderService).deleteWorkOrders(req.query.ids as string[]);
    return res.status(HttpStatus.OK).json(deletedCount);
  } catch (error) {
    next(error);
  }
};
