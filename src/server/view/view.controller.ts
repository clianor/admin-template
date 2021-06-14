import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

import { ViewService } from './view.service';

@Controller('/')
export class ViewController {
  constructor(private viewService: ViewService) {}

  async handler(req: Request, res: Response) {
    await this.viewService
      .getNextServer()
      .render(req, res, req.url, req.query as any);
  }

  @Get('*')
  public async showHome(@Req() req: Request, @Res() res: Response) {
    await this.handler(req, res);
  }

  @Get('_next*')
  public async assets(@Req() req: Request, @Res() res: Response) {
    await this.viewService
      .getNextServer()
      .render(req, res, req.url, req.query as any);
  }
}
