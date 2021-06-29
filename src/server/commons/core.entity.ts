import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
class CoreEntity {
  @IsString()
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
  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;
}

export default CoreEntity;
