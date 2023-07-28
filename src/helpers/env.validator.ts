import * as Joi from 'joi';

export const envVarsSchema = Joi.object({
  PORT: Joi.number().default(5050),

  JWT_SECRET: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});
