import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export default ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
  ignoreEnvFile: process.env.NODE_ENV === 'production',
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('production', 'development').default('development'),
    PORT: Joi.number().default(3000),
    PRIVATE_KEY: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    // SMTP 환경 변수
    SMTP_SECURE: Joi.boolean().default(false),
    MAIL_DOMAIN: Joi.string().required(),
    FROM_EMAIL: Joi.string().required(),
    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.string().required(),
    SMTP_USER: Joi.string().required(),
    SMTP_PASSWORD: Joi.string().required(),
  }),
});
