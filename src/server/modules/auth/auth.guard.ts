import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AllowAuthorizeType, AuthorizeType } from '@server/modules/auth/auth.decorator';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authorize = this.reflector.get<AllowAuthorizeType>('authorize', context.getHandler());

    if (!authorize) {
      return true;
    }

    const gqlCtx = GqlExecutionContext.create(context).getContext();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const session: Record<string, any> = request?.session || gqlCtx?.session || {};
    const { user } = session;

    // 비로그인 허용
    if (authorize === AuthorizeType.NotAuth) {
      return !user;
    }

    // Any일땐 체크하지 않음
    if (!user) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
