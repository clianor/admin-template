import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '@server/commons/core.dto';
import { AuthGroups } from '@server/entities/auth-groups.entity';

@InputType()
export class CreateAuthGroupInput extends PickType(AuthGroups, [
  'name',
  'description',
  'level',
  'roles',
]) {}

@ObjectType()
export class CreateAuthGroupOutput extends CoreOutput {}
