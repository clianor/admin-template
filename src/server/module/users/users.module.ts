import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@server/entities/user.entity';
import { Logging } from '@server/entities/logging.entity';
import { UsersResolver } from '@server/module/users/users.resolver';
import { UsersService } from '@server/module/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Logging, User])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
