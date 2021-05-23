import { celebrate, Joi, Segments } from 'celebrate';

export const createOrUpdateStocksValidation = celebrate({
  [Segments.BODY]: Joi.array().items(
    Joi.object({
      id: Joi.number().integer(),
      balance: Joi.number().integer().required(),
      productId: Joi.number().integer().required(),
    })
  ),
});
