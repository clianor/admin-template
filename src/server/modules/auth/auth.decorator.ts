import { SetMetadata } from '@nestjs/common';

export enum AuthorizeType {
  Any = 'Any',
}

export type AllowAuthorizeType = keyof typeof AuthorizeType;

export const PreAuthorize = (authorize: AllowAuthorizeType) =>
  SetMetadata('authorize', authorize);
