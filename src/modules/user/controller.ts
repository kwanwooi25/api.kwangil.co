import { Request, Response } from 'express';
import { HttpStatus } from '~const';

export const getCurrentUser = async (req: Request, res: Response) => {
  res.status(HttpStatus.OK).json(req.currentUser);
};
