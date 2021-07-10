import { Module } from '@nestjs/common';
import EnvConfig from '@server/configs/env.config';
import GqlConfig from '@server/configs/graphql.config';
import MailConfig from '@server/configs/mail.config';
import OrmConfig from '@server/configs/orm.config';
import { SeedsModules } from '@server/modules/seeds/seeds.modules';

@Module({
  imports: [EnvConfig, OrmConfig, GqlConfig, MailConfig, SeedsModules],
})
export class CommonModule {}
