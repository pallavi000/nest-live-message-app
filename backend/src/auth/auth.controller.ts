import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { userDto } from 'src/user/dto/user.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from 'src/guards/auth-jwt.guard';
import { IExpressRequest } from 'src/@types/auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async register(@Body() body: userDto) {
    try {
      const hashPassword = await this.userService.generateHashPassword(
        body.password,
      );
      const user = await this.userService.createUser({
        ...body,
        password: hashPassword,
      });

      const { password, ...payload } = user;
      const token = this.authService.generateToken(payload);
      return { token, user: payload };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/login')
  async login(@Body() body: loginDto) {
    try {
      console.log('route', body);
      const user = await this.userService.findUserByEmail(body.email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const validUser = await this.userService.comparePassword(
        body.password,
        user.password,
      );
      if (!validUser) {
        throw new BadRequestException('Invalid Password');
      }
      const { password, ...payload } = user;
      console.log('login success');
      const token = this.authService.generateToken(payload);
      console.log('token success');
      return { token, user: payload };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: IExpressRequest) {
    try {
      console.log(req.user);
      const user = await this.userService.findUserById(req.user.id);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
