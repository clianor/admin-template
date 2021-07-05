import { Module } from '@nestjs/common';
import { AuthViewController } from '@server/views/auth/auth-view.controller';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';

@Module({
  imports: [],
  providers: [ViewService],
  controllers: [ViewController, AuthViewController],
})
export class ViewModule {}
