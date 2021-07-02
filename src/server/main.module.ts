import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppModule } from '@server/modules/app.module';
import { AuthGuard } from '@server/modules/auth/auth.guard';
import { ViewModule } from '@server/views/view.module';

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
