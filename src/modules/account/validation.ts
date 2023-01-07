import { DeliveryMethod } from '@prisma/client';
import { celebrate, Joi, Segments } from 'celebrate';
import { DEFAULT_LIMIT } from '~const';

export const getAccountsValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    offset: Joi.number().integer().default(0),
    limit: Joi.number().integer().default(DEFAULT_LIMIT),
    accountName: Joi.string().allow('').default(''),
    withContacts: Joi.boolean().default(true),
  }),
});

export const createAccountValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
    crn: Joi.string().allow(''),
    deliveryMethod: Joi.string()
      .valid(...Object.values(DeliveryMethod))
      .default(DeliveryMethod.TBD),
    memo: Joi.string().allow(''),
    contacts: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        isBase: Joi.boolean().default(false),
        phone: Joi.string().allow(''),
        fax: Joi.string().allow(''),
        email: Joi.string().email().allow(''),
        address: Joi.string().allow(''),
        memo: Joi.string().allow(''),
      }),
    ),
  }),
});

export const createAccountsValidation = celebrate({
  [Segments.BODY]: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      crn: Joi.string().allow(''),
      deliveryMethod: Joi.string()
        .valid(...Object.values(DeliveryMethod))
        .default(DeliveryMethod.TBD),
      memo: Joi.string().allow(''),
      contacts: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
          isBase: Joi.boolean().default(false),
          phone: Joi.string().allow(''),
          fax: Joi.string().allow(''),
          email: Joi.string().email().allow(''),
          address: Joi.string().allow(''),
          memo: Joi.string().allow(''),
        }),
      ),
    }),
  ),
});

export const updateAccountValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string(),
    crn: Joi.string().allow(''),
    deliveryMethod: Joi.string()
      .valid(...Object.values(DeliveryMethod))
      .default(DeliveryMethod.TBD),
    memo: Joi.string().allow(''),
    contacts: Joi.array().items(
      Joi.object({
        id: Joi.number().integer().required(),
        accountId: Joi.number().integer(),
        title: Joi.string(),
        isBase: Joi.boolean().default(false),
        phone: Joi.string().allow(''),
        fax: Joi.string().allow(''),
        email: Joi.string().email().allow(''),
        address: Joi.string().allow(''),
        memo: Joi.string().allow(''),
        createdAt: Joi.date().allow(null),
        updatedAt: Joi.date().allow(null),
        deletedAt: Joi.date().allow(null),
      }),
    ),
    contactsToCreate: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        isBase: Joi.boolean().default(false),
        phone: Joi.string().allow(''),
        fax: Joi.string().allow(''),
        email: Joi.string().email().allow(''),
        address: Joi.string().allow(''),
        memo: Joi.string().allow(''),
      }),
    ),
    contactIdsToDelete: Joi.array().items(Joi.number().integer()),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    deletedAt: Joi.date().allow(null),
  }),
});

export const deleteAccountsValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    ids: Joi.array().items(Joi.number().integer()).required(),
  }),
});
