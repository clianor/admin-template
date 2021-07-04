import { Field, InputType, ObjectType } from '@nestjs/graphql';
import CoreEntity from '@server/commons/core.entity';
import { AuthRoles } from '@server/entities/auth-roles.entity';
import { Users } from '@server/entities/users.entity';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@InputType('AuthGroupInputType')
@ObjectType()
@Entity()
export class AuthGroups extends CoreEntity {
  @IsString()
  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column()
  description?: string;

  @IsOptional()
  @IsInt()
  @Field(() => Number, { nullable: true, defaultValue: 999 })
  @Column({ default: 999 })
  level: number;

  @Field(() => [Users])
  @OneToMany(() => Users, (users) => users.authGroup)
  users: Users[];

  @Field(() => [AuthRoles])
  @ManyToMany(() => AuthRoles, (authRoles) => authRoles.id, { eager: true })
  @JoinTable({
    name: 'auth_groups_roles',
  })
  roles: AuthRoles[];
}
