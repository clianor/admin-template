import { Module } from '@nestjs/common';
import { ViewModule } from './view/view.module';

@Module({
  imports: [ViewModule],
})
export class MainModule {}
