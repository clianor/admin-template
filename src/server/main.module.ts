import { Module } from '@nestjs/common';
import { AppModule } from '@server/module/app.module';
import { ViewModule } from '@server/view/view.module';

@Module({
  imports: [AppModule, ViewModule],
})
export class MainModule {}
