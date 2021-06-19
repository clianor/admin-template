import { Field, ObjectType } from '@nestjs/graphql';
import CoreEntity from '@server/common/core.entity';
import { IsEmail, IsString } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';

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
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
