import {
  HttpException,
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@server/entities/users.entity';
import {
  CreateUserInput,
  CreateUserOutput,
} from '@server/modules/users/dtos/create-user.dto';
import {
  EditProfileInput,
  EditProfileOutput,
} from '@server/modules/users/dtos/edit-profile.dto';
import {
  GetUsersInput,
  GetUsersOutput,
} from '@server/modules/users/dtos/get-users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
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

  async editProfile({
    userId,
    email,
    password,
    accessIP,
  }: EditProfileInput): Promise<EditProfileOutput> {
    try {
      const user = await this.userRepository.findOne({ id: userId });
      console.log(user);

      if (!user) {
        throw new NotFoundException({
          ok: false,
          error: '유저가 존재하지 않습니다.',
        });
      }

      if (email) {
        user.email = email;
      }

      if (password) {
        user.password = password;
      }

      if (accessIP) {
        user.accessIP = accessIP;
      }

      await this.userRepository.save(user);
      return { ok: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException({
        ok: false,
        error: '프로필 변경에 실패했습니다.',
      });
    }
  }

  async getUsers({ page, limit }: GetUsersInput): Promise<GetUsersOutput> {
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
        error: '유저를 가져오는데 실패했습니다.',
      });
    }
  }
}
