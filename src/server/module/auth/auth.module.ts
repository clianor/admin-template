import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@server/entities/user.entity';
import { AuthResolver } from '@server/module/auth/auth.resolver';
import { AuthService } from '@server/module/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
