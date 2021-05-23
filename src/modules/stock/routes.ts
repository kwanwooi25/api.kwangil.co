import { Router } from 'express';

import { createOrUpdateStocks } from './controller';
import { createOrUpdateStocksValidation } from './validation';

const router: Router = Router();

router.post('/', createOrUpdateStocksValidation, createOrUpdateStocks);

export { router as stockRouter };
