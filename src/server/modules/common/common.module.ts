import { Module } from '@nestjs/common';
import EnvConfig from '@server/configs/env.config';
import GqlConfig from '@server/configs/graphql.config';
import OrmConfig from '@server/configs/orm.config';

@Module({
  imports: [EnvConfig, OrmConfig, GqlConfig],
})
export class CommonModule {}
