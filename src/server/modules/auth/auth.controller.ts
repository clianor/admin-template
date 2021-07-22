import { Controller, Get, Res } from '@nestjs/common';
import { CAPTCHA_COOKIE } from '@server/commons/common';
import { AuthService } from '@server/modules/auth/auth.service';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('captcha')
  createCaptcha(@Res() res: Response) {
    const captcha = this.authService.createCaptcha();
    res.type('image/svg+xml');
    const salt = bcrypt.genSaltSync(4);
    const hash = bcrypt.hashSync(captcha.text, salt);

    res.cookie(CAPTCHA_COOKIE, hash, {
      maxAge: 1000 * 60 * 5, // 5분 후 만료
      secure: false,
      sameSite: true,
      httpOnly: true,
    });
    res.status(200).send(captcha.data);
  }
}
