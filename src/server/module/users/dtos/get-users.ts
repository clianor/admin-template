import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from '@server/common/pagination.dto';
import { User } from '@server/entities/user.entity';

@InputType()
export class GetUsersInput extends PaginationInput {}

@ObjectType()
export class GetUsersOutput extends PaginationOutput {
  @Field(() => [User], { nullable: true })
  results?: User[];
}
