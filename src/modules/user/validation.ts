import { celebrate, Joi, Segments } from 'celebrate';
import { DEFAULT_LIMIT } from '~const';

export const getUsersValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    offset: Joi.number().integer().default(0),
    limit: Joi.number().integer().default(DEFAULT_LIMIT),
  }),
});

export const updateUserValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().required(),
  }),
  [Segments.BODY]: Joi.object({
    email: Joi.string().email(),
    name: Joi.string(),
    mobile: Joi.string().allow(''),
    department: Joi.string().allow(''),
    position: Joi.string().allow(''),
    profileImageUrl: Joi.string().allow(''),
    createdAt: Joi.date().allow(null),
    updatedAt: Joi.date().allow(null),
    deletedAt: Joi.date().allow(null),
    isActive: Joi.boolean(),
    userRole: Joi.object(),
    userRoleId: Joi.number().integer(),
  }),
});
