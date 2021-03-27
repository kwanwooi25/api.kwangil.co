import { Router } from 'express';
import {
  createAccount,
  getAccountById,
  updateAccount,
  deleteAccounts,
  getAccounts,
  createAccounts,
  getAllAccounts,
} from './controller';
import {
  createAccountsValidation,
  createAccountValidation,
  deleteAccountsValidation,
  getAccountsValidation,
  updateAccountValidation,
} from './validation';

const router: Router = Router();

router.get('/list', getAccountsValidation, getAccounts);
router.get('/list/all', getAccountsValidation, getAllAccounts);
router.get('/:id', getAccountById);
router.post('/bulk', createAccountsValidation, createAccounts);
router.post('/', createAccountValidation, createAccount);
router.patch('/:id', updateAccountValidation, updateAccount);
router.delete('/', deleteAccountsValidation, deleteAccounts);

export { router as accountRouter };
