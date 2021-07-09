import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '@server/commons/core.dto';
import { Verifications } from '@server/entities/verifications.entity';

@InputType()
export class VerifyCodeInput extends PickType(Verifications, ['code']) {}

@ObjectType()
export class VerifyCodeOutput extends CoreOutput {}
