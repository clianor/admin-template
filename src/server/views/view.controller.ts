import { Controller, Get, Req, Res, Session } from '@nestjs/common';
import { PreAuthorize } from '@server/modules/auth/auth.decorator';
import { Request, Response } from 'express';
import { ViewService } from './view.service';

@Controller('/')
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get()
  public async showIndex(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }

  @PreAuthorize('Any')
  @Get('home')
  public async showHome(
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const { user } = session;
    const serverSideProps = { email: user.email };
    await this.viewService.handler(req, res, serverSideProps);
  }

  @Get('_next*')
  public async assets(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }
}
