import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as MySQLStore from 'express-mysql-session';
import * as session from 'express-session';
import * as helmet from 'helmet';
import { MainModule } from './main.module';

declare const module: any;

(async function () {
  const Store = MySQLStore(session);

  const app = await NestFactory.create(MainModule);
  app.useGlobalPipes(new ValidationPipe());
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }
  app.use(cookieParser());
  app.use(compression());
  app.use(
    session({
      secret: process.env.PRIVATE_KEY,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 30, // 30분으로 설정
      },
      store: new Store({
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        checkExpirationInterval: 1000 * 60 * 5, // 5분 주기로 만료된 세션 삭제
      }),
    }),
  );
  await app.listen(3000);

  if (module.hot && process.env.NODE_ENV !== 'production') {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
})();
