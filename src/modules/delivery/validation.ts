import { celebrate, Joi, Segments } from 'celebrate';
import { DEFAULT_LIMIT } from '~const';

import { DeliveryMethod } from '@prisma/client';

export const getDeliveriesValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    offset: Joi.number().integer().default(0),
    limit: Joi.number().integer().default(DEFAULT_LIMIT),
    date: Joi.date(),
    method: Joi.string().valid(...Object.values(DeliveryMethod)),
  }),
});

export const createDeliveriesValidation = celebrate({
  [Segments.BODY]: Joi.array().items(
    Joi.object({
      date: Joi.date().required(),
      method: Joi.string().valid(...Object.values(DeliveryMethod)),
      quantity: Joi.number().integer(),
      isDelivered: Joi.boolean().default(false),
      memo: Joi.string().allow(''),
      productId: Joi.number().integer().required(),
      workOrderId: Joi.string(),
    })
  ),
});
