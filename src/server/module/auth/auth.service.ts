import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@server/entities/user.entity';
import { LoginInput, LoginOutput } from '@server/module/auth/dtos/login.dto';
import { Repository } from 'typeorm';
import { CONTEXT } from '@nestjs/graphql';

@Injectable()
export class AuthService {
  private session: Record<string, any>;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

      const user = await this.userRepository.findOne(
        {
          email,
        },
        { select: ['id', 'password'] },
      );
      if (!user) {
        throw new NotFoundException({
          ok: false,
          error: '유저가 존재하지 않습니다.',
        });
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        throw new UnauthorizedException({
          ok: false,
          error: '잘못된 패스워드입니다',
        });
      }

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
}
