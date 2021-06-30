import { Field, InputType, ObjectType } from '@nestjs/graphql';
import CoreEntity from '@server/commons/core.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';
import { AuthGroupRoles } from '@server/entities/auth-group-roles.entity';

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

  @Field(() => [AuthGroupRoles])
  @ManyToMany(() => AuthGroupRoles, (authGroupRoles) => authGroupRoles.authRole)
  group: AuthGroupRoles[];
}
