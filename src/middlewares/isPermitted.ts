import { NextFunction, Request, Response } from 'express';
import { ErrorName } from '~const';
import { logger } from '~logger';

import { Permissions } from '@prisma/client';

export const isPermitted = (permissionsNeeded: Permissions[]) => (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debug('... Checking permission: %o', permissionsNeeded);
    if (
      !req.currentUser ||
      !req.currentUser.userRole ||
      !permissionsNeeded.every((permissionNeeded) => req.currentUser?.userRole.permissions.includes(permissionNeeded))
    ) {
      throw Error(ErrorName.UNAUTHORIZED);
    }
    return next();
  } catch (error) {
    error.message = ErrorName.UNAUTHORIZED;
    return next(error);
  }
};
