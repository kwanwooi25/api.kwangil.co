import { Router } from 'express';
import { isPermitted } from '~middlewares/isPermitted';

import { Permissions } from '@prisma/client';

import {
    createAccount, createAccounts, deleteAccounts, getAccountById, getAccounts, getAllAccounts,
    updateAccount
} from './controller';
import {
    createAccountsValidation, createAccountValidation, deleteAccountsValidation,
    getAccountsValidation, updateAccountValidation
} from './validation';

const router: Router = Router();

router.get('/list', isPermitted([Permissions.ACCOUNT_READ]), getAccountsValidation, getAccounts);
router.get('/list/all', isPermitted([Permissions.ACCOUNT_READ]), getAccountsValidation, getAllAccounts);
router.get('/:id', isPermitted([Permissions.ACCOUNT_READ]), getAccountById);
router.post('/bulk', isPermitted([Permissions.ACCOUNT_CREATE]), createAccountsValidation, createAccounts);
router.post('/', isPermitted([Permissions.ACCOUNT_CREATE]), createAccountValidation, createAccount);
router.patch('/:id', isPermitted([Permissions.ACCOUNT_UPDATE]), updateAccountValidation, updateAccount);
router.delete('/', isPermitted([Permissions.ACCOUNT_DELETE]), deleteAccountsValidation, deleteAccounts);

export { router as accountRouter };
