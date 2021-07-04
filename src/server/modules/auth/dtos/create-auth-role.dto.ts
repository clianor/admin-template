import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '@server/commons/core.dto';
import { AuthRoles } from '@server/entities/auth-roles.entity';

@InputType()
export class CreateAuthRoleInput extends PickType(AuthRoles, [
  'name',
  'description',
]) {}

@ObjectType()
export class CreateAuthRoleOutput extends CoreOutput {}
