import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { userDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsers() {
    const users = await this.userRepository.find();
    return users;
  }

  async createUser(body: userDto) {
    const user = await this.userRepository.insert({ ...body });
    return user;
  }

  async findUserById(Id: number) {
    const user = await this.userRepository.findOne({ where: { id: Id } });
  }
}
