import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import CoreEntity from '@server/common/core.entity';
import { User } from '@server/entities/user.entity';
import { IsNumber, IsString } from 'class-validator';

@ObjectType()
@Entity()
export class Logging extends CoreEntity {
  @IsString()
  @Column()
  contextType: string;

  @IsString()
  @Column({ nullable: true })
  inputArgs?: string;

  @IsNumber()
  @Column({ nullable: true })
  responseStatus?: number;

  @IsString()
  @Column({ nullable: true })
  response?: string;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  user?: User;
}
