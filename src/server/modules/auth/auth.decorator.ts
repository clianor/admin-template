import { SetMetadata } from '@nestjs/common';

export enum AuthorizeType {
  /**
   * 인증되지 않은 상태만 허용
   */
  NotAuth = 'NotAuth',
  /**
   * 인증된 유저 아무나
   */
  Any = 'Any',
}

export type AllowAuthorizeType = keyof typeof AuthorizeType;

export const PreAuthorize = (authorize: AllowAuthorizeType) =>
  SetMetadata('authorize', authorize);
