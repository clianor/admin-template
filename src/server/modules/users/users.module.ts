import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from '@server/entities/logs.entity';
import { Users } from '@server/entities/users.entity';
import { UsersResolver } from '@server/modules/users/users.resolver';
import { UsersService } from '@server/modules/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Logs, Users])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
