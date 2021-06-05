import { Router } from 'express';

import { createDeliveries, getDeliveries } from './controller';
import { createDeliveriesValidation, getDeliveriesValidation } from './validation';

const router: Router = Router();

router.get('/list', getDeliveriesValidation, getDeliveries);

router.post('/', createDeliveriesValidation, createDeliveries);

export { router as deliveryRouter };
