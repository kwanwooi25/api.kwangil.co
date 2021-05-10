import { celebrate, Joi, Segments } from 'celebrate';
import { DEFAULT_LIMIT } from '~const';

import { DeliveryMethod, PlateStatus, WorkOrderStatus } from '@prisma/client';

export const getWorkOrdersValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    offset: Joi.number().integer().default(0),
    limit: Joi.number().integer().default(DEFAULT_LIMIT),
    orderedAt: Joi.array().items(Joi.date()),
    accountName: Joi.string().allow('').default(''),
    productName: Joi.string().allow('').default(''),
    includeCompleted: Joi.boolean().default(false),
  }),
});

export const getWorkOrdersByDeadlineValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    deadline: Joi.date(),
  }),
});

export const getWorkOrderCountValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    orderedAt: Joi.array().items(Joi.date()),
  }),
});

export const createWorkOrderValidation = celebrate({
  [Segments.BODY]: Joi.object({
    orderedAt: Joi.date().default(new Date()),
    orderUpdatedAt: Joi.date().default(new Date()),
    deliverBy: Joi.date().required(),
    orderQuantity: Joi.number().integer().required(),
    isUrgent: Joi.boolean().default(false),
    shouldBePunctual: Joi.boolean().default(false),
    plateStatus: Joi.string().valid(...Object.values(PlateStatus)),
    isPlateReady: Joi.boolean().default(false),
    deliveryMethod: Joi.string().valid(...Object.values(DeliveryMethod)),
    workMemo: Joi.string().allow(''),
    deliveryMemo: Joi.string().allow(''),
    workOrderStatus: Joi.string().valid(...Object.values(WorkOrderStatus)),
    completedAt: Joi.date().allow(null),
    completedQuantity: Joi.number().integer().allow(null).default(0),
    deliveredAt: Joi.date().allow(null),
    deliveredQuantity: Joi.number().integer().allow(null).default(0),
    accountId: Joi.number().integer().required(),
    productId: Joi.number().integer().required(),
  }),
});

export const createWorkOrdersValidation = celebrate({
  [Segments.BODY]: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      orderedAt: Joi.date().default(new Date()),
      deliverBy: Joi.date().required(),
      orderQuantity: Joi.number().integer().required(),
      isUrgent: Joi.boolean().default(false),
      shouldBePunctual: Joi.boolean().default(false),
      plateStatus: Joi.string().valid(...Object.values(PlateStatus)),
      isPlateReady: Joi.boolean().default(false),
      deliveryMethod: Joi.string().valid(...Object.values(DeliveryMethod)),
      workMemo: Joi.string().allow(''),
      deliveryMemo: Joi.string().allow(''),
      workOrderStatus: Joi.string().valid(...Object.values(WorkOrderStatus)),
      completedAt: Joi.date().allow(null),
      completedQuantity: Joi.number().integer().allow(null).default(0),
      deliveredAt: Joi.date().allow(null),
      deliveredQuantity: Joi.number().integer().allow(null).default(0),
      accountName: Joi.string().required(),
      productName: Joi.string().required(),
      thickness: Joi.number().required(),
      length: Joi.number().required(),
      width: Joi.number().required(),
    })
  ),
});

export const updateWorkOrderValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object({
    deliverBy: Joi.date().required(),
    orderQuantity: Joi.number().integer().required(),
    isUrgent: Joi.boolean().default(false),
    shouldBePunctual: Joi.boolean().default(false),
    plateStatus: Joi.string().valid(...Object.values(PlateStatus)),
    isPlateReady: Joi.boolean().default(false),
    deliveryMethod: Joi.string().valid(...Object.values(DeliveryMethod)),
    workMemo: Joi.string().allow(''),
    deliveryMemo: Joi.string().allow(''),
    workOrderStatus: Joi.string().valid(...Object.values(WorkOrderStatus)),
    completedAt: Joi.date().allow(null),
    completedQuantity: Joi.number().integer().allow(null).default(0),
    deliveredAt: Joi.date().allow(null),
    deliveredQuantity: Joi.number().integer().allow(null).default(0),
    deletedAt: Joi.date().allow(null),
  }),
});

export const updateWorkOrdersValidation = celebrate({
  [Segments.BODY]: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        deliverBy: Joi.date().required(),
        orderQuantity: Joi.number().integer().required(),
        isUrgent: Joi.boolean().default(false),
        shouldBePunctual: Joi.boolean().default(false),
        plateStatus: Joi.string().valid(...Object.values(PlateStatus)),
        isPlateReady: Joi.boolean().default(false),
        deliveryMethod: Joi.string().valid(...Object.values(DeliveryMethod)),
        workMemo: Joi.string().allow(''),
        deliveryMemo: Joi.string().allow(''),
        workOrderStatus: Joi.string().valid(...Object.values(WorkOrderStatus)),
        completedAt: Joi.date().allow(null),
        completedQuantity: Joi.number().integer().allow(null).default(0),
        deliveredAt: Joi.date().allow(null),
        deliveredQuantity: Joi.number().integer().allow(null).default(0),
        deletedAt: Joi.date().allow(null),
      })
    )
    .required(),
});

export const deleteWorkOrdersValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    ids: Joi.array().items(Joi.string()).required(),
  }),
});
