import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '@server/commons/core.dto';
import { Users } from '@server/entities/users.entity';

@InputType()
export class CreateUserInput extends PickType(Users, ['email', 'password']) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {}
