import { User } from '@server/entities/user.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '@server/module/users/users.service';
import {
  CreateUserInput,
  CreateUserOutput,
} from '@server/module/users/dtos/create-user.dto';
import { UsersInput, UsersOutput } from '@server/module/users/dtos/get-users';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => CreateUserOutput)
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.usersService.createUser(createUserInput);
  }

  @Query(() => UsersOutput)
  getUsers(@Args('input') usersInput: UsersInput): Promise<UsersOutput> {
    return this.usersService.getUsers(usersInput);
  }
}
