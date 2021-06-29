import { Users } from '@server/entities/users.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { UsersService } from '@server/modules/users/users.service';
import {
  CreateUserInput,
  CreateUserOutput,
} from '@server/modules/users/dtos/create-user.dto';
import { UsersInput, UsersOutput } from '@server/modules/users/dtos/get-users';
import { LoggingInterceptor } from '@server/modules/logging/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Resolver(() => Users)
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
