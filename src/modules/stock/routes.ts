import { Router } from 'express';
import { isPermitted } from '~middlewares/isPermitted';

import { Permissions } from '@prisma/client';

import { createOrUpdateStocks } from './controller';
import { createOrUpdateStocksValidation } from './validation';

const router: Router = Router();

router.post(
  '/',
  isPermitted([Permissions.PRODUCT_CREATE, Permissions.PRODUCT_UPDATE]),
  createOrUpdateStocksValidation,
  createOrUpdateStocks
);

export { router as stockRouter };
