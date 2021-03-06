import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { CAPTCHA_COOKIE, LOCKED_MINUTES, LoginType, LOGIN_TYPE } from '@server/commons/common';
import { AuthGroups } from '@server/entities/auth-groups.entity';
import { AuthRoles } from '@server/entities/auth-roles.entity';
import { Users } from '@server/entities/users.entity';
import { Verifications } from '@server/entities/verifications.entity';
import {
  CreateAuthGroupInput,
  CreateAuthGroupOutput,
} from '@server/modules/auth/dtos/create-auth-group.dto';
import {
  CreateAuthRoleInput,
  CreateAuthRoleOutput,
} from '@server/modules/auth/dtos/create-auth-role.dto';
import { LoginInput, LoginOutput } from '@server/modules/auth/dtos/login.dto';
import { LogoutOutput } from '@server/modules/auth/dtos/logout.dto';
import { VerifyCodeInput, VerifyCodeOutput } from '@server/modules/auth/dtos/verify-code.dto';
import { MailService } from '@server/modules/mail/mail.service';
import * as bcrypt from 'bcryptjs';
import { cloneDeep } from 'lodash';
import * as svgCaptcha from 'svg-captcha';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private session: Record<string, any>;
  constructor(
    @InjectRepository(AuthGroups)
    private readonly authGroupsRepository: Repository<AuthGroups>,
    @InjectRepository(AuthRoles)
    private readonly authRolesRepository: Repository<AuthRoles>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Verifications)
    private readonly verificationsRepository: Repository<Verifications>,
    private readonly mailService: MailService,
    @Inject(CONTEXT) private context,
  ) {
    this.session = context.session;
  }

  createCaptcha() {
    return svgCaptcha.create({
      size: 6,
      noise: 10,
      height: 100,
      width: 250,
    });
  }

  async correctCaptcha(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }

  async login({ email, password, captcha }: LoginInput): Promise<LoginOutput> {
    try {
      if (this.session.user) {
        throw new UnauthorizedException({
          ok: false,
          error: '?????? ??????????????? ????????????',
        });
      }

      const user = await this.usersRepository.findOne(
        {
          email,
        },
        {
          select: [
            'id',
            'email',
            'password',
            'loginFailCount',
            'lastLoginedAt',
            'loginBlockedAt',
            'authGroup',
          ],
        },
      );
      if (!user) {
        throw new NotFoundException({
          ok: false,
          error: '????????? ???????????? ????????????.',
        });
      }

      const now = new Date();
      const prevTimeAgo = cloneDeep(now);
      prevTimeAgo.setMinutes(prevTimeAgo.getMinutes() - LOCKED_MINUTES);

      if (user.loginBlockedAt > prevTimeAgo) {
        throw new UnauthorizedException({
          ok: false,
          error: `${LOCKED_MINUTES}????????? ?????? ???????????????.`,
        });
      }

      const passwordCorrect = await user.checkPassword(password);
      user.password = undefined;

      let captchaCorrect = true;
      if (LOGIN_TYPE === LoginType.Captcha) {
        const captchaCookie = this.context.cookies[CAPTCHA_COOKIE] || '';
        captchaCorrect = await this.correctCaptcha(captcha, captchaCookie);
        console.log(captchaCookie, captchaCorrect);
      }

      if (!passwordCorrect || !captchaCorrect) {
        if (user.loginBlockedAt) {
          user.loginBlockedAt = null;
          user.loginFailCount = 0;
        }

        user.loginFailCount = user.loginFailCount + 1;

        if (user.loginFailCount >= 5) {
          user.loginBlockedAt = now;
        }

        this.usersRepository.save(user).catch((error) => {
          console.error(error);
        });

        throw new UnauthorizedException({
          ok: false,
          error: '????????? ?????????????????????',
        });
      }

      if (user.loginFailCount > 0) {
        user.loginFailCount = 0;
      }
      user.lastLoginedAt = now;
      this.usersRepository.save(user).catch((error) => {
        console.error(error);
      });

      await this.verificationsRepository.delete({ user: { id: user.id } });
      const verification = await this.verificationsRepository.save(
        this.verificationsRepository.create({
          user,
        }),
      );

      if (LOGIN_TYPE === LoginType.Basic || LOGIN_TYPE === LoginType.Captcha) {
        this.session.user = user;
      } else if (LOGIN_TYPE === LoginType.Mail) {
        this.mailService.sendEmail({
          to: email,
          subject: '?????????????????????',
          htmlContent: `????????????: ${verification.code}`,
        });
        this.session.verification = verification;
      }

      return { ok: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException({
        ok: false,
        error: '???????????? ??????????????????.',
      });
    }
  }

  async verifyCode({ code }: VerifyCodeInput): Promise<VerifyCodeOutput> {
    try {
      if (this.session.user) {
        throw new UnauthorizedException({
          ok: false,
          error: '?????? ??????????????? ????????????',
        });
      }

      if (!this.session.verification) {
        throw new BadRequestException({
          ok: false,
          error: '????????? ????????? ???????????? ????????????.',
        });
      }
      if (code !== this.session.verification.code) {
        throw new BadRequestException({
          ok: false,
          error: '????????? ????????? ????????????.',
        });
      }

      const { id } = this.session.verification.user;
      const user = await this.usersRepository.findOne(
        { id },
        {
          select: ['id', 'email', 'loginFailCount', 'lastLoginedAt', 'loginBlockedAt', 'authGroup'],
        },
      );
      if (!user) {
        throw new NotFoundException({
          ok: false,
          error: '????????? ???????????? ????????????.',
        });
      }
      this.session.user = user;
      await this.verificationsRepository.delete(this.session.verification.id);
      delete this.session.verification;

      return { ok: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException({
        ok: false,
        error: '????????? ??????????????????.',
      });
    }
  }

  async logout(): Promise<LogoutOutput> {
    if (this.session.user) {
      this.session.destroy();
      return {
        ok: true,
      };
    }

    throw new UnauthorizedException({
      ok: false,
      error: '???????????? ????????? ????????????.',
    });
  }

  async createAuthGroup({
    name,
    description,
    level,
    roles,
  }: CreateAuthGroupInput): Promise<CreateAuthGroupOutput> {
    try {
      const exists = await this.authGroupsRepository.findOne({ name });
      if (exists) {
        throw new ConflictException({
          ok: false,
          error: '?????? ???????????? ???????????????.',
        });
      }

      await this.authGroupsRepository.save(
        this.authGroupsRepository.create({ name, description, level, roles }),
      );
      return { ok: true };
    } catch {
      throw new InternalServerErrorException({
        ok: false,
        error: '?????? ????????? ??????????????????.',
      });
    }
  }

  async createAuthRole({ name, description }: CreateAuthRoleInput): Promise<CreateAuthRoleOutput> {
    try {
      const exists = await this.authRolesRepository.findOne({ name });
      if (exists) {
        throw new ConflictException({
          ok: false,
          error: '?????? ???????????? ???????????????.',
        });
      }

      await this.authRolesRepository.save(this.authRolesRepository.create({ name, description }));
      return { ok: true };
    } catch {
      throw new InternalServerErrorException({
        ok: false,
        error: '?????? ????????? ??????????????????.',
      });
    }
  }
}
