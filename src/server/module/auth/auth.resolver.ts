import { User } from '@server/entities/user.entity';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '@server/module/auth/auth.service';
import { LoginInput, LoginOutput } from '@server/module/auth/dtos/login.dto';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }
}
