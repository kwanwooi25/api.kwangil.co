import { PlateMaterial } from '@prisma/client';
import { celebrate, Joi, Segments } from 'celebrate';
import { DEFAULT_LIMIT } from '~const';

export const getPlatesValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    offset: Joi.number().integer().default(0),
    limit: Joi.number().integer().default(DEFAULT_LIMIT),
    id: Joi.allow(Joi.number().integer(), Joi.string()),
    code: Joi.allow(Joi.number().integer(), Joi.string()),
    round: Joi.array().items(Joi.number()),
    length: Joi.array().items(Joi.number()),
    accountName: Joi.string().allow('').default(''),
    productName: Joi.string().allow('').default(''),
    name: Joi.string().allow('').default(''),
  }),
});

export const createPlateValidation = celebrate({
  [Segments.BODY]: Joi.object({
    code: Joi.number().required(),
    round: Joi.number().required(),
    length: Joi.number().required(),
    name: Joi.string().allow('').default(''),
    material: Joi.string().valid(...Object.values(PlateMaterial)),
    location: Joi.string().allow('').default(''),
    memo: Joi.string().allow('').default(''),
    products: Joi.array(),
  }),
});

export const updatePlateValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().required(),
  }),
  [Segments.BODY]: Joi.object({
    code: Joi.number().required(),
    round: Joi.number().required(),
    length: Joi.number().required(),
    name: Joi.string().allow('').default(''),
    material: Joi.string().valid(...Object.values(PlateMaterial)),
    location: Joi.string().allow('').default(''),
    memo: Joi.string().allow('').default(''),
    products: Joi.array(),
    productsToDisconnect: Joi.array(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    deletedAt: Joi.date().allow(null),
  }),
});

export const deletePlatesValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    ids: Joi.array().items(Joi.number().integer()).required(),
  }),
});
