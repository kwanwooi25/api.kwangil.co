import { Router } from 'express';
import { isPermitted } from '~middlewares/isPermitted';

import { Permissions } from '@prisma/client';

import { createQuote, getAllQuotes, getQuoteById, getQuotes } from './controller';
import { createQuoteValidation, getQuotesValidation } from './validation';

const router: Router = Router();

router.get('/list', isPermitted([Permissions.QUOTE_READ]), getQuotesValidation, getQuotes);
router.get('/list/all', isPermitted([Permissions.QUOTE_READ]), getQuotesValidation, getAllQuotes);
router.get('/:id', isPermitted([Permissions.QUOTE_READ]), getQuoteById);
router.post('/', isPermitted([Permissions.QUOTE_CREATE]), createQuoteValidation, createQuote);

export { router as quoteRouter };
