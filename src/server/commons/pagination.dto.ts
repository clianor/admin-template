import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';
import { CoreOutput } from './core.dto';

@InputType()
export class PaginationInput {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Field(() => Int, { nullable: true, defaultValue: 25 })
  limit: number;
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int, { nullable: true })
  totalResults?: number;
}
