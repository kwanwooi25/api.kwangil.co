import { Router } from 'express';
import {
  createWorkOrdersValidation,
  createWorkOrderValidation,
  deleteWorkOrdersValidation,
  getWorkOrdersValidation,
  updateWorkOrderValidation,
  updateWorkOrdersValidation,
} from './validation';
import {
  createWorkOrder,
  createWorkOrders,
  deleteWorkOrders,
  getWorkOrderById,
  getWorkOrders,
  updateWorkOrder,
  updateWorkOrders,
} from './controller';

const router: Router = Router();

router.get('/list', getWorkOrdersValidation, getWorkOrders);
router.get('/:id', getWorkOrderById);

router.post('/bulk', createWorkOrdersValidation, createWorkOrders);
router.post('/', createWorkOrderValidation, createWorkOrder);

router.patch('/:id', updateWorkOrderValidation, updateWorkOrder);
router.patch('/', updateWorkOrdersValidation, updateWorkOrders);

router.delete('/', deleteWorkOrdersValidation, deleteWorkOrders);

export { router as workOrderRouter };
