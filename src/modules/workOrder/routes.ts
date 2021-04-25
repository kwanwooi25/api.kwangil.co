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
  getAllWorkOrders,
  getWorkOrderById,
  getWorkOrders,
  updateWorkOrder,
  updateWorkOrders,
} from './controller';

const router: Router = Router();

router.get('/list', getWorkOrdersValidation, getWorkOrders);
router.get('/list/all', getWorkOrdersValidation, getAllWorkOrders);
router.get('/:id', getWorkOrderById);

router.post('/bulk', createWorkOrdersValidation, createWorkOrders);
router.post('/', createWorkOrderValidation, createWorkOrder);

router.patch('/:id', updateWorkOrderValidation, updateWorkOrder);
router.patch('/', updateWorkOrdersValidation, updateWorkOrders);

router.delete('/', deleteWorkOrdersValidation, deleteWorkOrders);

export { router as workOrderRouter };
