import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '@server/entities/user.entity';
import { CoreOutput } from '@server/common/core.dto';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {}
