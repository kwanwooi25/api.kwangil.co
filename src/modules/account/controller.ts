import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { HttpStatus } from '~const';
import AccountService from './service';

export const getAccountById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await Container.get(AccountService).getAccountById(+req.params.id);
    return res.status(HttpStatus.OK).json(account);
  } catch (error) {
    next(error);
  }
};

export const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(AccountService).getAccounts(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAllAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(AccountService).getAllAccounts(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdAccount = await Container.get(AccountService).createAccount(req.body);
    return res.status(HttpStatus.CREATED).json(createdAccount);
  } catch (error) {
    next(error);
  }
};

export const createAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(AccountService).createAccounts(req.body);
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

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedAccount = await Container.get(AccountService).updateAccount(+req.params.id, { ...req.body });
    return res.status(HttpStatus.OK).json(updatedAccount);
  } catch (error) {
    next(error);
  }
};

export const deleteAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids = [] as number[] } = req.query;
    const count = await Container.get(AccountService).deleteAccounts(ids as number[]);
    return res.status(HttpStatus.OK).json(count);
  } catch (error) {
    next(error);
  }
};
