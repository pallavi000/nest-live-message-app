import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { userDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<userDto[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async createUser(body: userDto): Promise<userDto> {
    const userEntity = this.userRepository.create({ ...body });
    const user = await this.userRepository.save(userEntity);
    return user;
  }

  async findUserById(Id: number): Promise<userDto> {
    const user = await this.userRepository.findOne({ where: { id: Id } });
    return user;
  }

  async findUserByEmail(email: string): Promise<userDto> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user;
  }

  async generateHashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    console.log(password, hashPassword);
    const isRightPassword = await bcrypt.compare(password, hashPassword);
    if (!isRightPassword) {
      return false;
    }
    return true;
  }
}
