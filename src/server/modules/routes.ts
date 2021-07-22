import { AppModule } from '@server/modules/app.module';
import { AuthModule } from '@server/modules/auth/auth.module';
import { HealthModule } from '@server/modules/health/health.module';
import { Routes } from 'nest-router';

export const routes: Routes = [
  {
    path: '/api',
    module: AppModule,
    children: [HealthModule, AuthModule],
  },
];
