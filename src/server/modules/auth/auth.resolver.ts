import { User } from '@server/entities/user.entity';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { AuthService } from '@server/module/auth/auth.service';
import { LoginInput, LoginOutput } from '@server/module/auth/dtos/login.dto';
import { LoggingInterceptor } from '@server/module/logging/logging.interceptor';
import { LogoutOutput } from '@server/module/auth/dtos/logout.dto';

@UseInterceptors(LoggingInterceptor)
@Resolver(() => User)
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
}
