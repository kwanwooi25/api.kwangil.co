import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { HttpStatus } from '~const';

import UserService from './service';

export const getCurrentUser = async (req: Request, res: Response) => {
  res.status(HttpStatus.OK).json(req.currentUser);
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(UserService).getUsers(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await Container.get(UserService).updateUser(+req.params.id, { ...req.body });
    return res.status(HttpStatus.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
