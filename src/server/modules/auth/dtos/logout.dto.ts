import { ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '@server/commons/core.dto';

@ObjectType()
export class LogoutOutput extends CoreOutput {}
