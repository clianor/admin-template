import { Module } from '@nestjs/common';import { TypeOrmModule } from '@nestjs/typeorm';import { Users } from '@server/entities/users.entity';import { SeedsService } from '@server/modules/seeds/seeds.service';@Module({  imports: [TypeOrmModule.forFeature([Users])],  providers: [SeedsService],})export class SeedsModules {  constructor(private readonly seedService: SeedsService) {    if (process.env.NODE_ENV !== 'production') {      seedService        .createAdmin()        .then(() => console.log('admin user init success'))        .catch(() => console.error('admin user init failure'));    }  }}