import { Router } from 'express';

import {
    createWorkOrder, createWorkOrders, deleteWorkOrders, getAllWorkOrders, getWorkOrderById,
    getWorkOrderCount, getWorkOrders, getWorkOrdersByDeadline, updateWorkOrder, updateWorkOrders
} from './controller';
import {
    createWorkOrdersValidation, createWorkOrderValidation, deleteWorkOrdersValidation,
    getWorkOrderCountValidation, getWorkOrdersValidation, updateWorkOrdersValidation,
    updateWorkOrderValidation
} from './validation';

const router: Router = Router();

router.get('/list', getWorkOrdersValidation, getWorkOrders);
router.get('/list/all', getWorkOrdersValidation, getAllWorkOrders);
router.get('/list/deadline', getWorkOrdersByDeadline);
router.get('/count', getWorkOrderCountValidation, getWorkOrderCount);
router.get('/:id', getWorkOrderById);

router.post('/bulk', createWorkOrdersValidation, createWorkOrders);
router.post('/', createWorkOrderValidation, createWorkOrder);

router.patch('/:id', updateWorkOrderValidation, updateWorkOrder);
router.patch('/', updateWorkOrdersValidation, updateWorkOrders);

router.delete('/', deleteWorkOrdersValidation, deleteWorkOrders);

export { router as workOrderRouter };
