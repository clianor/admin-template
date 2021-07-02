import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from '@server/entities/logs.entity';
import { Users } from '@server/entities/users.entity';
import { AuthResolver } from '@server/modules/auth/auth.resolver';
import { AuthService } from '@server/modules/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Logs, Users])],
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
