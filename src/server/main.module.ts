import { Module } from '@nestjs/common';
import { AppModule } from '@server/modules/app.module';
import { ViewModule } from '@server/views/view.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@server/modules/auth/auth.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [AppModule, ViewModule],
})
export class MainModule {}
