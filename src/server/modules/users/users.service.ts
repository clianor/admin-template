import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '@server/entities/users.entity';
import { CreateUserInput, CreateUserOutput } from '@server/modules/users/dtos/create-user.dto';
import { EditProfileInput, EditProfileOutput } from '@server/modules/users/dtos/edit-profile.dto';
import { GetUsersInput, GetUsersOutput } from '@server/modules/users/dtos/get-users';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser({ email, password }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      // 유저 존재 여부 확인.
      const exists = await this.usersRepository.findOne({ email });
      if (exists) {
        throw new ConflictException({
          ok: false,
          error: '이미 가입된 이메일입니다.',
        });
      }

      // 유저 생성
      await this.usersRepository.save(this.usersRepository.create({ email, password }));
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

  async editProfile({ userId, email, password }: EditProfileInput): Promise<EditProfileOutput> {
    try {
      const user = await this.usersRepository.findOne({ id: userId });

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

      await this.usersRepository.save(user);
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
      const [users, totalResults] = await this.usersRepository.findAndCount({
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
    } catch (error) {
      throw new InternalServerErrorException({
        ok: false,
        error: '유저를 가져오는데 실패했습니다.',
      });
    }
  }
}
