import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@server/entities/user.entity';
import { Logging } from '@server/entities/logging.entity';
import { AuthResolver } from '@server/module/auth/auth.resolver';
import { AuthService } from '@server/module/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Logging, User])],
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
