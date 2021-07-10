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
import {
  VerifyCodeInput,
  VerifyCodeOutput,
} from '@server/modules/auth/dtos/verify-code.dto';
import { MailService } from '@server/modules/mail/mail.service';
import { cloneDeep } from 'lodash';
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
    this.session = context.req.session;
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      if (this.session.user) {
        throw new UnauthorizedException({
          ok: false,
          error: '이미 로그인되어 있습니다',
        });
      }

      const user = await this.usersRepository.findOne(
        {
          email,
        },
        {
          select: [
            'id',
            'password',
            'loginFailCount',
            'lastLoginedAt',
            'loginBlockedAt',
          ],
        },
      );
      if (!user) {
        throw new NotFoundException({
          ok: false,
          error: '유저가 존재하지 않습니다.',
        });
      }

      const lockedMinutes = 30;

      const now = new Date();
      const prevTimeAgo = cloneDeep(now);
      prevTimeAgo.setMinutes(prevTimeAgo.getMinutes() - lockedMinutes);

      if (user.loginBlockedAt > prevTimeAgo) {
        throw new UnauthorizedException({
          ok: false,
          error: `${lockedMinutes}분동안 잠긴 계정입니다.`,
        });
      }

      const passwordCorrect = await user.checkPassword(password);
      user.password = undefined;
      if (!passwordCorrect) {
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
          error: '잘못된 패스워드입니다',
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
      this.mailService.sendEmail({
        to: email,
        subject: '인증코드입니다',
        htmlContent: `인증코드: ${verification.code}`,
      });
      this.session.verification = verification;

      return { ok: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException({
        ok: false,
        error: '로그인에 실패했습니다.',
      });
    }
  }

  async verifyCode({ code }: VerifyCodeInput): Promise<VerifyCodeOutput> {
    try {
      if (this.session.user) {
        throw new UnauthorizedException({
          ok: false,
          error: '이미 로그인되어 있습니다',
        });
      }

      if (!this.session.verification) {
        throw new BadRequestException({
          ok: false,
          error: '유효한 인증이 존재하지 않습니다.',
        });
      }
      if (code !== this.session.verification.code) {
        throw new BadRequestException({
          ok: false,
          error: '유효한 코드가 아닙니다.',
        });
      }

      const { id } = this.session.verification.user;
      const user = await this.usersRepository.findOne({ id });
      if (!user) {
        throw new NotFoundException({
          ok: false,
          error: '유저가 존재하지 않습니다.',
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
        error: '인증에 실패했습니다.',
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
      error: '로그인된 상태가 아닙니다.',
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
          error: '이미 존재하는 그룹입니다.',
        });
      }

      await this.authGroupsRepository.save(
        this.authGroupsRepository.create({ name, description, level, roles }),
      );
      return { ok: true };
    } catch {
      throw new InternalServerErrorException({
        ok: false,
        error: '그룹 생성에 실패했습니다.',
      });
    }
  }

  async createAuthRole({
    name,
    description,
  }: CreateAuthRoleInput): Promise<CreateAuthRoleOutput> {
    try {
      const exists = await this.authRolesRepository.findOne({ name });
      if (exists) {
        throw new ConflictException({
          ok: false,
          error: '이미 존재하는 권한입니다.',
        });
      }

      await this.authRolesRepository.save(
        this.authRolesRepository.create({ name, description }),
      );
      return { ok: true };
    } catch {
      throw new InternalServerErrorException({
        ok: false,
        error: '권한 생성에 실패했습니다.',
      });
    }
  }
}
