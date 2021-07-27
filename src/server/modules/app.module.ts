import { Module } from '@nestjs/common';import { AuthModule } from '@server/modules/auth/auth.module';import { CommonModule } from '@server/modules/common/common.module';import { HealthModule } from '@server/modules/health/health.module';import { routes } from '@server/modules/routes';import { UsersModule } from '@server/modules/users/users.module';import { RouterModule } from 'nest-router';@Module({  imports: [CommonModule, RouterModule.forRoutes(routes), HealthModule, AuthModule, UsersModule],})export class AppModule {}