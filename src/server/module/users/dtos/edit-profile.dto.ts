import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from '@server/common/core.dto';
import { User } from '@server/entities/user.entity';
import { IsString } from 'class-validator';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password', 'accessIP']),
) {
  @IsString()
  @Field(() => String)
  userId: string;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
