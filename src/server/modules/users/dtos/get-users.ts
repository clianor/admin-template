import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PaginationInput, PaginationOutput } from '@server/commons/pagination.dto';
import { Users } from '@server/entities/users.entity';

@InputType()
export class GetUsersInput extends PaginationInput {}

@ObjectType()
export class GetUsersOutput extends PaginationOutput {
  @Field(() => [Users], { nullable: true })
  results?: Users[];
}
