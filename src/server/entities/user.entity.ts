import { Field, ObjectType } from '@nestjs/graphql';
import CoreEntity from '@server/common/core.entity';
import { IsEmail, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class UserEntity extends CoreEntity {
  @IsEmail()
  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @IsString()
  @Field(() => String)
  @Column({ select: false })
  password: string;
}
