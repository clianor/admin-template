import { Module } from '@nestjs/common';
import { AppModule } from '@server/modules/app.module';
import { ViewModule } from '@server/views/view.module';

@Module({
  imports: [AppModule, ViewModule],
})
export class MainModule {}
