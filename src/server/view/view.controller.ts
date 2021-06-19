import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

import { ViewService } from './view.service';

@Controller('/')
export class ViewController {
  constructor(private viewService: ViewService) {}

  async handler(
    req: Request,
    res: Response,
    serverSideProps?: { [key: string]: any },
  ) {
    await this.viewService
      .getNextServer()
      .render(
        req,
        res,
        req.url,
        Object.assign(req.query, serverSideProps || {}),
      );
  }

  @Get()
  public async showIndex(@Req() req: Request, @Res() res: Response) {
    await this.handler(req, res);
  }

  @Get('home')
  public async showHome(@Req() req: Request, @Res() res: Response) {
    const serverSideProps = { name: 'clianor' };
    await this.handler(req, res, serverSideProps);
  }

  @Get('_next*')
  public async assets(@Req() req: Request, @Res() res: Response) {
    await this.handler(req, res);
  }
}
