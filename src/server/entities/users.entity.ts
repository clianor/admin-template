import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import CoreEntity from '@server/commons/core.entity';
import { AuthGroups } from '@server/entities/auth-groups.entity';
import * as bcrypt from 'bcryptjs';
import { IsDate, IsEmail, IsIP, IsNumber, IsString } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';

@InputType('UserInputType')
@ObjectType()
@Entity()
export class Users extends CoreEntity {
  @IsEmail()
  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ select: false })
  password: string;

  @IsIP()
  @Field(() => String, { nullable: true })
  @Column({ length: 50, nullable: true })
  accessIP?: string;

  @IsDate()
  @Field(() => Date, { nullable: true })
  @Column('datetime', { nullable: true })
  lastLoginedAt?: Date;

  @IsNumber()
  @Field(() => Number, { nullable: true })
  @Column({ default: 0 })
  loginFailCount: number;

  @IsDate()
  @Field(() => Date, { nullable: true })
  @Column('datetime', { nullable: true })
  loginBlockedAt?: Date;

  @Field(() => AuthGroups, { nullable: true })
  @ManyToOne(() => AuthGroups, (authGroups) => authGroups.id, {
    nullable: true,
  })
  authGroup?: AuthGroups;

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
