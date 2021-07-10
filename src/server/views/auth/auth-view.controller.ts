import { Controller, Get, Req, Res } from '@nestjs/common';
import { PreAuthorize } from '@server/modules/auth/auth.decorator';
import { ViewService } from '@server/views/view.service';
import { Request, Response } from 'express';

@Controller('/auth')
export class AuthViewController {
  constructor(private viewService: ViewService) {}

  @PreAuthorize('NotAuth')
  @Get('login')
  public async loginView(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }

  @PreAuthorize('NotAuth')
  @Get('verify')
  public async verifyView(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }
}
