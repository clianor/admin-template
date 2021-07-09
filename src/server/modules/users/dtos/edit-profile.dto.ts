import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from '@server/commons/core.dto';
import { Users } from '@server/entities/users.entity';
import { IsString } from 'class-validator';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(Users, ['email', 'password']),
) {
  @IsString()
  @Field(() => String)
  userId: string;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
