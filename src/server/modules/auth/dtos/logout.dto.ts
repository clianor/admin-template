import { ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '@server/common/core.dto';

@ObjectType()
export class LogoutOutput extends CoreOutput {}
