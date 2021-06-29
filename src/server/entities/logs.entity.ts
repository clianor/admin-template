import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import CoreEntity from '@server/commons/core.entity';
import { Users } from '@server/entities/users.entity';
import { IsNumber, IsString } from 'class-validator';

@ObjectType()
@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Logs extends CoreEntity {
  @IsString()
  @Column()
  contextType: string;

  @IsString()
  @Column({ nullable: true, default: '' })
  fieldName?: string;

  @IsString()
  @Column({ nullable: true })
  inputArgs?: string;

  @IsNumber()
  @Column({ nullable: true })
  responseStatus?: number;

  @IsString()
  @Column({ nullable: true })
  response?: string;

  @IsString()
  @Column({ nullable: true })
  accessIP?: string;

  @ManyToOne(() => Users, (user) => user.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  user?: Users;
}
