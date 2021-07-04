import { UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Users } from '@server/entities/users.entity';
import { AuthService } from '@server/modules/auth/auth.service';
import {
  CreateAuthGroupInput,
  CreateAuthGroupOutput,
} from '@server/modules/auth/dtos/create-auth-group.dto';
import { LoginInput, LoginOutput } from '@server/modules/auth/dtos/login.dto';
import { LogoutOutput } from '@server/modules/auth/dtos/logout.dto';
import { LoggingInterceptor } from '@server/modules/logging/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Resolver(() => Users)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => LogoutOutput)
  logout(): Promise<LogoutOutput> {
    return this.authService.logout();
  }

  @Mutation(() => CreateAuthGroupOutput)
  createAuthGroup(
    @Args('input') createAuthGroupInput: CreateAuthGroupInput,
  ): Promise<CreateAuthGroupOutput> {
    return this.authService.createAuthGroup(createAuthGroupInput);
  }
}
