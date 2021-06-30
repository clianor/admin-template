import { TypeOrmModule } from '@nestjs/typeorm';

export default TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.NODE_ENV !== 'production',
  synchronize: process.env.NODE_ENV !== 'production',
  entities: [
    process.env.NODE_ENV !== 'production'
      ? 'dist/**/*.entity{.ts,.js}'
      : 'src/**/*.entity{.ts,.js}',
  ],
  keepConnectionAlive: true,
});
