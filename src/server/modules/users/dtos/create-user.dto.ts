import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '@server/common/core.dto';
import { User } from '@server/entities/user.entity';

@InputType()
export class CreateUserInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {}
