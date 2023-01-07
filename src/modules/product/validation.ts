import { celebrate, Joi, Segments } from 'celebrate';
import { DEFAULT_LIMIT } from '~const';

import { DeliveryMethod, PrintSide } from '@prisma/client';

export const getProductsValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    offset: Joi.number().integer().default(0),
    limit: Joi.number().integer().default(DEFAULT_LIMIT),
    accountName: Joi.string().allow('').default(''),
    name: Joi.string().allow('').default(''),
    thickness: Joi.string().allow('').default(''),
    length: Joi.string().allow('').default(''),
    width: Joi.string().allow('').default(''),
    extColor: Joi.string().allow('').default(''),
    printColor: Joi.string().allow('').default(''),
  }),
});

export const createProductValidation = celebrate({
  [Segments.BODY]: Joi.object({
    accountId: Joi.number().integer().required(),
    name: Joi.string().required(),
    thickness: Joi.number().required(),
    length: Joi.number().required(),
    width: Joi.number().required(),
    extColor: Joi.string().allow(''),
    extIsAntistatic: Joi.boolean().default(false),
    extMemo: Joi.string().allow(''),
    printSide: Joi.string().valid(...Object.values(PrintSide)),
    printFrontColorCount: Joi.number().integer().default(0),
    printFrontColor: Joi.string().allow(''),
    printFrontPosition: Joi.string().allow(''),
    printBackColorCount: Joi.number().integer().default(0),
    printBackColor: Joi.string().allow(''),
    printBackPosition: Joi.string().allow(''),
    printMemo: Joi.string().allow(''),
    cutPosition: Joi.string().allow(''),
    cutIsUltrasonic: Joi.boolean().default(false),
    cutIsForPowder: Joi.boolean().default(false),
    cutPunchCount: Joi.number().default(0),
    cutPunchSize: Joi.string().allow(''),
    cutPunchPosition: Joi.string().allow(''),
    cutMemo: Joi.string().allow(''),
    packMaterial: Joi.string().allow(''),
    packUnit: Joi.number().default(0),
    packCanDeliverAll: Joi.boolean().default(false),
    packMemo: Joi.string().allow(''),
    shouldKeepRemainder: Joi.boolean().default(false),
    deliveryMethod: Joi.string()
      .valid(...Object.values(DeliveryMethod))
      .default(DeliveryMethod.TBD),
    productMemo: Joi.string().allow(''),
    images: Joi.array().items(
      Joi.object({
        fileName: Joi.string().required(),
        imageUrl: Joi.string().required(),
      }),
    ),
  }),
});

export const createProductsValidation = celebrate({
  [Segments.BODY]: Joi.array().items(
    Joi.object({
      accountName: Joi.string().required(),
      name: Joi.string().required(),
      thickness: Joi.number().required(),
      length: Joi.number().required(),
      width: Joi.number().required(),
      extColor: Joi.string().allow(''),
      extIsAntistatic: Joi.boolean().default(false),
      extMemo: Joi.string().allow(''),
      printSide: Joi.string().valid(...Object.values(PrintSide)),
      printFrontColorCount: Joi.number().integer().default(0),
      printFrontColor: Joi.string().allow(''),
      printFrontPosition: Joi.string().allow(''),
      printBackColorCount: Joi.number().integer().default(0),
      printBackColor: Joi.string().allow(''),
      printBackPosition: Joi.string().allow(''),
      printMemo: Joi.string().allow(''),
      cutPosition: Joi.string().allow(''),
      cutIsUltrasonic: Joi.boolean().default(false),
      cutIsForPowder: Joi.boolean().default(false),
      cutPunchCount: Joi.number().default(0),
      cutPunchSize: Joi.string().allow(''),
      cutPunchPosition: Joi.string().allow(''),
      cutMemo: Joi.string().allow(''),
      packMaterial: Joi.string().allow(''),
      packUnit: Joi.number().default(0),
      packCanDeliverAll: Joi.boolean().default(false),
      packMemo: Joi.string().allow(''),
      shouldKeepRemainder: Joi.boolean().default(false),
      deliveryMethod: Joi.string()
        .valid(...Object.values(DeliveryMethod))
        .default(DeliveryMethod.TBD),
      productMemo: Joi.string().allow(''),
      images: Joi.array().items(
        Joi.object({
          fileName: Joi.string().required(),
          imageUrl: Joi.string().required(),
        }),
      ),
    }),
  ),
});

export const updateProductValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().required(),
  }),
  [Segments.BODY]: Joi.object({
    accountId: Joi.number().integer().required(),
    name: Joi.string().required(),
    thickness: Joi.number().required(),
    length: Joi.number().required(),
    width: Joi.number().required(),
    extColor: Joi.string().allow(''),
    extIsAntistatic: Joi.boolean().default(false),
    extMemo: Joi.string().allow(''),
    printSide: Joi.string().valid(...Object.values(PrintSide)),
    printFrontColorCount: Joi.number().integer().default(0),
    printFrontColor: Joi.string().allow(''),
    printFrontPosition: Joi.string().allow(''),
    printBackColorCount: Joi.number().integer().default(0),
    printBackColor: Joi.string().allow(''),
    printBackPosition: Joi.string().allow(''),
    printMemo: Joi.string().allow(''),
    cutPosition: Joi.string().allow(''),
    cutIsUltrasonic: Joi.boolean().default(false),
    cutIsForPowder: Joi.boolean().default(false),
    cutPunchCount: Joi.number().default(0),
    cutPunchSize: Joi.string().allow(''),
    cutPunchPosition: Joi.string().allow(''),
    cutMemo: Joi.string().allow(''),
    packMaterial: Joi.string().allow(''),
    packUnit: Joi.number().default(0),
    packCanDeliverAll: Joi.boolean().default(false),
    packMemo: Joi.string().allow(''),
    shouldKeepRemainder: Joi.boolean().default(false),
    deliveryMethod: Joi.string()
      .valid(...Object.values(DeliveryMethod))
      .default(DeliveryMethod.TBD),
    productMemo: Joi.string().allow(''),
    images: Joi.array(),
    imagesToCreate: Joi.array().items(
      Joi.object({
        fileName: Joi.string().required(),
        imageUrl: Joi.string().required(),
      }),
    ),
    imageIdsToDelete: Joi.array().items(Joi.number().integer()),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    deletedAt: Joi.date().allow(null),
  }),
});

export const deleteProductsValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    ids: Joi.array().items(Joi.number().integer()).required(),
  }),
});
