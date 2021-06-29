import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from '@server/commons/pagination.dto';
import { Users } from '@server/entities/users.entity';

@InputType()
export class UsersInput extends PaginationInput {}

@ObjectType()
export class UsersOutput extends PaginationOutput {
  @Field(() => [Users], { nullable: true })
  results?: Users[];
}
