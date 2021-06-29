import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Users } from '@server/entities/users.entity';
import { CoreOutput } from '@server/commons/core.dto';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(Users, ['email', 'password', 'accessIP']),
) {
  @IsString()
  @Field(() => String)
  userId: string;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
