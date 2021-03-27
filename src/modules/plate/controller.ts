import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { HttpStatus } from '~const';
import PlateService from './service';

export const getPlateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plate = await Container.get(PlateService).getPlateById(+req.params.id);
    return res.status(HttpStatus.OK).json(plate);
  } catch (error) {
    next(error);
  }
};

export const getPlates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(PlateService).getPlates(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const createPlate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plate = await Container.get(PlateService).createPlate(req.body);
    return res.status(HttpStatus.CREATED).json(plate);
  } catch (error) {
    next(error);
  }
};

export const updatePlate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedPlate = await Container.get(PlateService).updatePlate(+req.params.id, req.body);
    return res.status(HttpStatus.OK).json(updatedPlate);
  } catch (error) {
    next(error);
  }
};

export const deletePlates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids = [] as number[] } = req.query;
    const count = await Container.get(PlateService).deletePlates(ids as number[]);
    return res.status(HttpStatus.OK).json(count);
  } catch (error) {
    next(error);
  }
};
