import { Module } from '@nestjs/common';
import { CommonModule } from '@server/modules/common/common.module';
import { AuthModule } from '@server/modules/auth/auth.module';
import { UsersModule } from '@server/modules/users/users.module';

@Module({
  imports: [CommonModule, AuthModule, UsersModule],
})
export class AppModule {}
