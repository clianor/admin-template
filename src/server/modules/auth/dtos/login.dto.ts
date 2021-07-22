import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '@server/commons/core.dto';
import { Users } from '@server/entities/users.entity';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class LoginInput extends PickType(Users, ['email', 'password']) {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true, defaultValue: '' })
  captcha?: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {}
