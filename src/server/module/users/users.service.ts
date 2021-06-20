import {
  HttpException,
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@server/entities/user.entity';
import {
  CreateUserInput,
  CreateUserOutput,
} from '@server/module/users/dtos/create-user.dto';
import { UsersInput, UsersOutput } from '@server/module/users/dtos/get-users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser({
    email,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      // 유저 존재 여부 확인.
      const exists = await this.userRepository.findOne({ email });
      if (exists) {
        throw new ConflictException({
          ok: false,
          error: '이미 가입된 이메일입니다.',
        });
      }

      // 유저 생성
      await this.userRepository.save(
        this.userRepository.create({ email, password }),
      );
      return { ok: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        ok: false,
        error: '유저 생성에 실패했습니다.',
      });
    }
  }

  async getUsers({ page, limit }: UsersInput): Promise<UsersOutput> {
    try {
      const [users, totalResults] = await this.userRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'ASC',
        },
      });

      return {
        ok: true,
        results: users,
        totalPages: Math.ceil(totalResults / limit),
        totalResults,
      };
    } catch {
      throw new InternalServerErrorException({
        ok: false,
        error: '유저를 가져우는데 실패했습니다.',
      });
    }
  }
}
