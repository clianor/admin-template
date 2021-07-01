import { Module } from '@nestjs/common';
import EnvConfig from '@server/configs/env.config';
import OrmConfig from '@server/configs/orm.config';
import GqlConfig from '@server/configs/graphql.config';

@Module({
  imports: [EnvConfig, OrmConfig, GqlConfig],
})
export class CommonModule {}
