import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { userDto } from './dto/user.dto';
import { AuthGuard } from 'src/guards/auth-jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUsers() {
    try {
      const users = await this.userService.getUsers();
      return users;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('')
  async createUser(@Body() body: userDto) {
    try {
      console.log(body, 'controller');
      const user = await this.userService.createUser(body);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') userId: number) {
    try {
      const user = await this.userService.findUserById(userId);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
