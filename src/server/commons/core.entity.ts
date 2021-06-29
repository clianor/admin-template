import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNumber } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
class CoreEntity {
  @IsNumber()
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDate()
  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @IsDate()
  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @IsDate()
  @Field(() => Date)
  @DeleteDateColumn()
  deletedAt: Date;
}

export default CoreEntity;
