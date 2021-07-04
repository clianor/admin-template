import { Field, InputType, ObjectType } from '@nestjs/graphql';
import CoreEntity from '@server/commons/core.entity';
import { AuthGroups } from '@server/entities/auth-groups.entity';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToMany } from 'typeorm';

@InputType('AuthRoleInputType')
@ObjectType()
@Entity()
export class AuthRoles extends CoreEntity {
  @IsString()
  @Field(() => String)
  @Column()
  name: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column()
  description?: string;

  @Field(() => [AuthGroups])
  @ManyToMany(() => AuthGroups, (authGroups) => authGroups.id)
  group: AuthGroups[];
}
