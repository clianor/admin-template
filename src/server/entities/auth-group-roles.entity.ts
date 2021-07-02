import { Field, InputType, ObjectType } from '@nestjs/graphql';
import CoreEntity from '@server/commons/core.entity';
import { AuthGroups } from '@server/entities/auth-groups.entity';
import { AuthRoles } from '@server/entities/auth-roles.entity';
import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@InputType('AuthGroupRoleInputType')
@ObjectType()
@Entity()
export class AuthGroupRoles extends CoreEntity {
  @IsString()
  @Field(() => String)
  @Column()
  authGroupId: string;

  @IsString()
  @Field(() => String)
  @Column()
  authRoleId: string;

  @Field(() => AuthGroups)
  @ManyToOne(() => AuthGroups, (authGroups) => authGroups.roles)
  @JoinColumn()
  authGroup: AuthGroups;

  @Field(() => AuthRoles)
  @ManyToOne(() => AuthRoles, (authRoles) => authRoles.id)
  @JoinColumn()
  authRole: AuthRoles;
}
