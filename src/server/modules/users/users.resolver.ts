import { UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Users } from '@server/entities/users.entity';
import { LoggingInterceptor } from '@server/modules/logging/logging.interceptor';
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
import { UsersService } from '@server/modules/users/users.service';

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
