import { celebrate, Joi, Segments } from 'celebrate';

export const signUpValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
    mobile: Joi.string().allow(''),
    department: Joi.string().allow(''),
    position: Joi.string().allow(''),
    profileImageUrl: Joi.string().allow(''),
  }),
});

export const loginValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});
