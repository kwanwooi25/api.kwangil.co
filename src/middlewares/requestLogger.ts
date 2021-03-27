import { NextFunction, Request, Response } from 'express';
import { logger } from '~logger';

export const requestLogger = async (req: Request, res: Response, next: NextFunction) => {
  logger.debug(
    `Calling [${req.method}] ${req.path}
  query: %o
  params: %o
  body: %o`,
    req.query,
    req.params,
    req.body
  );

  return next();
};
