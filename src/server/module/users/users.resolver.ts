import { UserEntity } from '@server/entities/user.entity';
import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '@server/module/users/users.service';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserEntity])
  users() {
    return this.usersService.findAll();
  }
}
