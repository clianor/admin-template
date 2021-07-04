import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '@server/entities/users.entity';
import { LoginInput, LoginOutput } from '@server/modules/auth/dtos/login.dto';
import { LogoutOutput } from '@server/modules/auth/dtos/logout.dto';
import { cloneDeep } from 'lodash';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private session: Record<string, any>;
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
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
            'accessIP',
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
          error: `${prevTimeAgo}분동안 잠긴 계정입니다.`,
        });
      }

      const passwordCorrect = await user.checkPassword(password);
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

      const { headers, socket } = this.context.req;
      let ip = headers['x-forwarded-for'] || socket.remoteAddress;
      if (ip.substr(0, 7) === '::ffff:') {
        ip = ip.substr(7);
      }

      if (user.accessIP !== ip) {
        throw new UnauthorizedException({
          ok: false,
          error: '허용되지 않은 IP입니다.',
        });
      }

      if (user.loginFailCount > 0) {
        user.loginFailCount = 0;
      }
      user.lastLoginedAt = now;
      this.usersRepository.save(user).catch((error) => {
        console.error(error);
      });

      this.session.user = user;

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
}
