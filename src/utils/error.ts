import { NextFunction, Request, Response } from 'express';
import { DEFAULT_ERROR, ERROR_RESPONSE } from '~const';
import { ErrorResponse } from '~interfaces/common';
import { logger } from '~logger';

export const handleError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const errorResponse: ErrorResponse = ERROR_RESPONSE[err.message] || ERROR_RESPONSE[DEFAULT_ERROR];
  logger.error(err);
  res.status(errorResponse.statusCode).json(errorResponse);
};
