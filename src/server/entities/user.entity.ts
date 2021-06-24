import { Field, InputType, ObjectType } from '@nestjs/graphql';
import CoreEntity from '@server/common/core.entity';
import { IsDate, IsEmail, IsIP, IsNumber, IsString } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';

@InputType('UserInputType')
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @IsEmail()
  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @IsString()
  @Field(() => String)
  @Column({ select: false })
  password: string;

  @IsIP()
  @Field(() => String)
  @Column({ length: 50, nullable: true })
  accessIP?: string;

  @IsDate()
  @Field(() => Date)
  @Column('datetime', { nullable: true })
  lastLoginedAt?: Date;

  @IsNumber()
  @Field(() => Number)
  @Column({ default: 0 })
  loginFailCount: number;

  @IsDate()
  @Field(() => Date)
  @Column('datetime', { nullable: true })
  loginBlockedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
