import { celebrate, Joi, Segments } from 'celebrate';
import { DEFAULT_LIMIT } from '~const';

export const getQuotesValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    offset: Joi.number().integer().default(0),
    limit: Joi.number().integer().default(DEFAULT_LIMIT),
  }),
});

export const createQuoteValidation = celebrate({
  [Segments.BODY]: Joi.object({
    productName: Joi.string().allow(''),
    thickness: Joi.number().required(),
    length: Joi.number().required(),
    width: Joi.number().required(),
    printColorCount: Joi.number().integer().default(0),
    variableRate: Joi.number().required(),
    printCostPerRoll: Joi.number().integer(),
    defectiveRate: Joi.number().integer().default(8),
    plateRound: Joi.number(),
    plateLength: Joi.number(),
    unitPrice: Joi.number().required(),
    minQuantity: Joi.number().integer().required(),
    plateCost: Joi.number().integer(),
    plateCount: Joi.number().integer(),
    accountId: Joi.number().integer().required(),
  }),
});
