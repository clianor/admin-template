import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from './core.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Field(() => Int, { defaultValue: 25 })
  limit: number;
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int, { nullable: true })
  totalResults?: number;
}