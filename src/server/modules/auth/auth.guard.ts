import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AllowAuthorizeType } from '@server/modules/auth/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authorize = this.reflector.get<AllowAuthorizeType>(
      'authorize',
      context.getHandler(),
    );
    if (!authorize) {
      return true;
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const session = request.session as Record<string, any>;

    const { user } = session;
    if (!user) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
