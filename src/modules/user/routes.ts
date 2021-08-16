import { Router } from 'express';
import { isPermitted } from '~middlewares/isPermitted';

import { Permissions } from '@prisma/client';

import { getCurrentUser, getUsers, updateUser } from './controller';
import { getUsersValidation, updateUserValidation } from './validation';

const router: Router = Router();

router.get('/me', getCurrentUser);
router.get('/list', isPermitted([Permissions.USER_READ]), getUsersValidation, getUsers);

router.patch('/:id', isPermitted([Permissions.USER_UPDATE]), updateUserValidation, updateUser);

export { router as userRouter };
