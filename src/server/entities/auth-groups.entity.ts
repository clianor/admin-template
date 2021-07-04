import { Field, InputType, ObjectType } from '@nestjs/graphql';
import CoreEntity from '@server/commons/core.entity';
import { AuthGroupRoles } from '@server/entities/auth-group-roles.entity';
import { Users } from '@server/entities/users.entity';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

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
  @Field(() => Number, { nullable: true })
  @Column()
  level?: number;

  @Field(() => [Users])
  @OneToMany(() => Users, (users) => users.authGroup)
  users: Users[];

  @Field(() => [AuthGroupRoles])
  @ManyToMany(
    () => AuthGroupRoles,
    (authGroupRoles) => authGroupRoles.authGroup,
  )
  roles: AuthGroupRoles[];
}
