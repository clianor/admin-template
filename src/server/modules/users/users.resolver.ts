import { Users } from '@server/entities/users.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { UsersService } from '@server/modules/users/users.service';
import {
  CreateUserInput,
  CreateUserOutput,
} from '@server/modules/users/dtos/create-user.dto';
import {
  GetUsersInput,
  GetUsersOutput,
} from '@server/modules/users/dtos/get-users';
import { LoggingInterceptor } from '@server/modules/logging/logging.interceptor';
import {
  EditProfileInput,
  EditProfileOutput,
} from '@server/modules/users/dtos/edit-profile.dto';

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
