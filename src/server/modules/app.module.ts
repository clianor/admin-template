import envConfig from '@server/configs/env.config';
import ormConfig from '@server/configs/orm.config';
import graphqlConfig from '@server/configs/graphql.config';
import { Module } from '@nestjs/common';
import { UsersModule } from '@server/modules/users/users.module';
import { AuthModule } from '@server/modules/auth/auth.module';

@Module({
  imports: [envConfig, ormConfig, graphqlConfig, AuthModule, UsersModule],
})
export class AppModule {}
