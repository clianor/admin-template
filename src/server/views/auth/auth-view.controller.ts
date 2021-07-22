import { Controller, Get, Req, Res } from '@nestjs/common';
import { LOGIN_TYPE } from '@server/commons/common';
import { PreAuthorize } from '@server/modules/auth/auth.decorator';
import { ViewService } from '@server/views/view.service';
import { Request, Response } from 'express';

@Controller('/auth')
export class AuthViewController {
  constructor(private viewService: ViewService) {}

  @PreAuthorize('NotAuth')
  @Get('login')
  public async loginView(@Req() req: Request, @Res() res: Response) {
    const serverSideProps = { loginType: LOGIN_TYPE };
    await this.viewService.handler(req, res, serverSideProps);
  }

  @PreAuthorize('NotAuth')
  @Get('verify')
  public async verifyView(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }
}
