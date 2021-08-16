import { Router } from 'express';
import { isPermitted } from '~middlewares/isPermitted';

import { Permissions } from '@prisma/client';

import { createDeliveries, getDeliveries } from './controller';
import { createDeliveriesValidation, getDeliveriesValidation } from './validation';

const router: Router = Router();

router.get('/list', isPermitted([Permissions.DELIVERY_READ]), getDeliveriesValidation, getDeliveries);

router.post('/', isPermitted([Permissions.DELIVERY_CREATE]), createDeliveriesValidation, createDeliveries);

export { router as deliveryRouter };
