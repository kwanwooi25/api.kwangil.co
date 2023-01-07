import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { HttpStatus } from '~const';
import ProductService from './service';

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Container.get(ProductService).getProductById(+req.params.id);
    return res.status(HttpStatus.OK).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(ProductService).getProducts(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(ProductService).getAllProducts(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdProduct = await Container.get(ProductService).createProduct(req.body);
    return res.status(HttpStatus.CREATED).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

export const createProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(ProductService).createProducts(req.body);
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

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedProduct = await Container.get(ProductService).updateProduct(
      +req.params.id,
      req.body,
    );
    return res.status(HttpStatus.OK).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryMethodByAccountId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const count = await Container.get(ProductService).updateDeliveryMethodByAccountId(
      +req.params.accountId,
      req.body,
    );
    return res.status(HttpStatus.OK).json(count);
  } catch (error) {
    next(error);
  }
};

export const deleteProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids = [] as number[] } = req.query;
    const count = await Container.get(ProductService).deleteProducts(ids as number[]);
    return res.status(HttpStatus.OK).json(count);
  } catch (error) {
    next(error);
  }
};
