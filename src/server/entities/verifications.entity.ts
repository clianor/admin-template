import { Field, InputType, ObjectType } from '@nestjs/graphql';
import CoreEntity from '@server/commons/core.entity';
import { Users } from '@server/entities/users.entity';
import { IsString } from 'class-validator';
import { nanoid } from 'nanoid';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@InputType()
@ObjectType()
@Entity()
export class Verifications extends CoreEntity {
  @IsString()
  @Field(() => String)
  @Column()
  code: string;

  @Field(() => Users)
  @OneToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Users;

  @BeforeInsert()
  createCode(): void {
    this.code = nanoid(10);
  }
}
