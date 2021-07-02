import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export default ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
  ignoreEnvFile: process.env.NODE_ENV === 'production',
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('production', 'development')
      .default('development'),
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    PRIVATE_KEY: Joi.string().required(),
  }),
});
