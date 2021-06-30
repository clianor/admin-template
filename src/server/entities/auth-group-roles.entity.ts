import CoreEntity from '@server/commons/core.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { AuthGroups } from '@server/entities/auth-groups.entity';
import { AuthRoles } from '@server/entities/auth-roles.entity';

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
