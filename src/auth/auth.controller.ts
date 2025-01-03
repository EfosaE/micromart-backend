import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { Request, Response } from 'express';
import { SkipAuth } from 'src/decorators/skip-auth';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/signIn-user.dto';
import { User } from '@prisma/client';
import { CreateSellerDto } from 'src/users/dto/create-seller.dto';

// Define the type to extract only the `id` and `name`
type UserData = Pick<User, 'id' | 'name'>;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('signup/user')
  registerUser(@Body() user: CreateUserDto) {
    return this.authService.signUpUser(user);
  }
  @SkipAuth()
  @Post('signup/seller')
  registerSeller(@Body() seller: CreateSellerDto) {
    return this.authService.signUpSeller(seller);
  }
  @SkipAuth()
  @Post('login')
  @ApiOperation({
    summary: 'Logs the user in and set the tokens in an http-only cookie ',
  })
  @ApiResponse({
    schema: {
      example: { message: `user@email.com logged in sucessfully` },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  loginUser(@Body() loginUserDto: LoginDto, @Res() res: Response) {
    return this.authService.login(loginUserDto, res);
  }

  // @UseGuards(AuthGuard) no longer necessary as AuthGuard is already global
  @Get('profile')
  getProfile(@Req() req: Request) {
    // Access the user data that was attached in middleware
    const user = req['user'];
    console.log('BE called !!', user);
    return user;
  }

  // refresh token endpoint Test
  @SkipAuth()
  @Get('refresh')
  async refreshEndpoint(
    @Req() req: Request
  ): Promise<{ accessToken: string; user: UserData }> {
    console.log('Cookies from Express:', req.cookies);
    const refreshToken = req.cookies['refresh_token']; // Securely retrieve refresh token from cookies

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing: Please login');
    }
    // Validate the refresh token
    const user = await this.authService.validateRefreshToken(refreshToken);
    console.log('user', user);
    const formattedUser = {
      id: user.sub,
      name: user.username,
      activeRole: user.role,
    };
    const newAccessToken =
      await this.authService.createAccessToken(formattedUser);

    return { accessToken: newAccessToken, user: formattedUser };
  }
}
