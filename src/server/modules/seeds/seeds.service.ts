import { Injectable } from '@nestjs/common';import { InjectRepository } from '@nestjs/typeorm';import { Users } from '@server/entities/users.entity';import { Repository } from 'typeorm';@Injectable()export class SeedsService {  constructor(    @InjectRepository(Users)    private readonly userRepository: Repository<Users>,  ) {}  async createAdmin(): Promise<boolean> {    try {      const email = 'admin@example.com';      const exists = await this.userRepository.findOne({ email });      if (!exists) {        await this.userRepository.save(          this.userRepository.create({            email,            password: 'test1234',            accessIP: '127.0.0.1',          }),        );      }      return true;    } catch {      return false;    }  }}