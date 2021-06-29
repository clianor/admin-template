import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Users } from '@server/entities/users.entity';
import { CoreOutput } from '@server/commons/core.dto';

@InputType()
export class LoginInput extends PickType(Users, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {}
