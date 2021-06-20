import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as MySQLStore from 'express-mysql-session';
import { MainModule } from './main.module';

declare const module: any;

(async function () {
  const Store = MySQLStore(session);

  const app = await NestFactory.create(MainModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: process.env.PRIVATE_KEY,
      resave: false,
      saveUninitialized: false,
      store: new Store({
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }),
    }),
  );
  await app.listen(3000);

  if (module.hot && process.env.NODE_ENV !== 'production') {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
})();
