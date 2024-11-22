import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { Request } from 'express';
import { SkipAuth } from 'src/utils/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('signup')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpUser(createUserDto);
  }

  @SkipAuth()
  @Post('login')
  @HttpCode(200)
  loginUser(@Body() loginUserDto: LoginDto) {
    return this.authService.login(loginUserDto);
  }

  // @UseGuards(AuthGuard) no longer necessary as AuthGuard is already global
  @Get('profile')
  getProfile(@Req() req: Request) {
    // Access the user data that was attached in middleware
    const user = req['user'];
    return user;
  }
}
