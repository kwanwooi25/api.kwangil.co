import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { HttpStatus } from '~const';
import AuthService from './service';

export const signUpUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loginResult = await Container.get(AuthService).signUp(req.body);
    res.status(HttpStatus.OK).json(loginResult);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loginResult = await Container.get(AuthService).login(req.body);
    res.status(HttpStatus.OK).json(loginResult);
  } catch (error) {
    next(error);
  }
};
