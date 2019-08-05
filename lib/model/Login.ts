import Joi from '@hapi/joi';

// VALIDATION
export const validationLoginSchema = {
  email: Joi.string()
    .min(6)
    .max(255)
    .required()
    .email(),
  password: Joi.string()
    .min(6)
    .max(1024)
    .required()
}

export const isValidateLogin = (data: any): Joi.ValidationResult<any> => {
  return Joi.validate(data, validationLoginSchema);
}
