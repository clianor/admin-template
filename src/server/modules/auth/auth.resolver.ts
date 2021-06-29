import { Users } from '@server/entities/users.entity';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { AuthService } from '@server/modules/auth/auth.service';
import { LoginInput, LoginOutput } from '@server/modules/auth/dtos/login.dto';
import { LoggingInterceptor } from '@server/modules/logging/logging.interceptor';
import { LogoutOutput } from '@server/modules/auth/dtos/logout.dto';

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
}
