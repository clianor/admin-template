import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '@server/commons/core.dto';
import { Users } from '@server/entities/users.entity';

@InputType()
export class LoginInput extends PickType(Users, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {}
