import { Router } from 'express';
import { isPermitted } from '~middlewares/isPermitted';

import { Permissions } from '@prisma/client';

import {
    completeWorkOrders, createWorkOrder, createWorkOrders, deleteWorkOrders, getAllWorkOrders,
    getWorkOrderById, getWorkOrderCount, getWorkOrders, getWorkOrdersByDeadline,
    getWorkOrdersByProductId, getWorkOrdersNeedPlate, updateWorkOrder, updateWorkOrders
} from './controller';
import {
    completeWorkOrdersValidation, createWorkOrdersValidation, createWorkOrderValidation,
    deleteWorkOrdersValidation, getWorkOrderCountValidation, getWorkOrdersValidation,
    updateWorkOrdersValidation, updateWorkOrderValidation
} from './validation';

const router: Router = Router();

router.get('/list', isPermitted([Permissions.WORK_ORDER_READ]), getWorkOrdersValidation, getWorkOrders);
router.get('/list/all', isPermitted([Permissions.WORK_ORDER_READ]), getWorkOrdersValidation, getAllWorkOrders);
router.get('/list/deadline', isPermitted([Permissions.WORK_ORDER_READ]), getWorkOrdersByDeadline);
router.get('/list/needPlate', isPermitted([Permissions.WORK_ORDER_READ]), getWorkOrdersNeedPlate);
router.get('/list/:productId', isPermitted([Permissions.WORK_ORDER_READ]), getWorkOrdersByProductId);
router.get('/count', isPermitted([Permissions.WORK_ORDER_READ]), getWorkOrderCountValidation, getWorkOrderCount);
router.get('/:id', isPermitted([Permissions.WORK_ORDER_READ]), getWorkOrderById);

router.post('/bulk', isPermitted([Permissions.WORK_ORDER_CREATE]), createWorkOrdersValidation, createWorkOrders);
router.post('/', isPermitted([Permissions.WORK_ORDER_CREATE]), createWorkOrderValidation, createWorkOrder);

router.patch(
  '/complete',
  isPermitted([Permissions.WORK_ORDER_UPDATE]),
  completeWorkOrdersValidation,
  completeWorkOrders
);
router.patch('/:id', isPermitted([Permissions.WORK_ORDER_UPDATE]), updateWorkOrderValidation, updateWorkOrder);
router.patch('/', isPermitted([Permissions.WORK_ORDER_UPDATE]), updateWorkOrdersValidation, updateWorkOrders);

router.delete('/', isPermitted([Permissions.WORK_ORDER_DELETE]), deleteWorkOrdersValidation, deleteWorkOrders);

export { router as workOrderRouter };
