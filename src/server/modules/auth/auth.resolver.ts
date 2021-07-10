import { UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Users } from '@server/entities/users.entity';
import { PreAuthorize } from '@server/modules/auth/auth.decorator';
import { AuthService } from '@server/modules/auth/auth.service';
import {
  CreateAuthGroupInput,
  CreateAuthGroupOutput,
} from '@server/modules/auth/dtos/create-auth-group.dto';
import {
  CreateAuthRoleInput,
  CreateAuthRoleOutput,
} from '@server/modules/auth/dtos/create-auth-role.dto';
import { LoginInput, LoginOutput } from '@server/modules/auth/dtos/login.dto';
import { LogoutOutput } from '@server/modules/auth/dtos/logout.dto';
import {
  VerifyCodeInput,
  VerifyCodeOutput,
} from '@server/modules/auth/dtos/verify-code.dto';
import { LoggingInterceptor } from '@server/modules/logging/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Resolver(() => Users)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @PreAuthorize('NotAuth')
  @Mutation(() => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }

  @PreAuthorize('NotAuth')
  @Mutation(() => VerifyCodeOutput)
  verifyCode(
    @Args('input') verifyCodeInput: VerifyCodeInput,
  ): Promise<VerifyCodeOutput> {
    return this.authService.verifyCode(verifyCodeInput);
  }

  @PreAuthorize('Any')
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

  @Mutation(() => CreateAuthRoleOutput)
  createAuthRole(
    @Args('input') createAuthRoleInput: CreateAuthRoleInput,
  ): Promise<CreateAuthRoleOutput> {
    return this.authService.createAuthRole(createAuthRoleInput);
  }
}
