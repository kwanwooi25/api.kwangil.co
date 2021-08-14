import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import Container from 'typedi';
import { jwtConfig } from '~config';
import { ErrorName } from '~const';
import { logger } from '~logger';
import UserService from '~modules/user/service';

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debug('... Getting Token from req.headers');
    const token = getTokenFromHeader(req);

    logger.debug('... Verifying Token');
    const decoded = verify(token, jwtConfig.secret);

    // @ts-ignore
    const { id } = decoded;

    req.currentUserId = id;
    const currentUser = await Container.get(UserService).getUserById(id);
    if (currentUser?.isActive) {
      req.currentUser = currentUser;
    }

    return next();
  } catch (error) {
    error.message = ErrorName.TOKEN_INVALID;
    return next(error);
  }
};

function getTokenFromHeader(req: Request): string {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  return '';
}
