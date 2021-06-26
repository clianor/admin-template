import { User } from '@server/entities/user.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { UsersService } from '@server/module/users/users.service';
import {
  CreateUserInput,
  CreateUserOutput,
} from '@server/module/users/dtos/create-user.dto';
import {
  GetUsersInput,
  GetUsersOutput,
} from '@server/module/users/dtos/get-users';
import { LoggingInterceptor } from '@server/module/logging/logging.interceptor';
import {
  EditProfileInput,
  EditProfileOutput,
} from '@server/module/users/dtos/edit-profile.dto';

@UseInterceptors(LoggingInterceptor)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => CreateUserOutput)
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.usersService.createUser(createUserInput);
  }

  @Mutation(() => EditProfileOutput)
  editProfile(
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(editProfileInput);
  }

  @Query(() => GetUsersOutput)
  getUsers(
    @Args('input') getUsersInput: GetUsersInput,
  ): Promise<GetUsersOutput> {
    return this.usersService.getUsers(getUsersInput);
  }
}
