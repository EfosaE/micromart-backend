import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { Request, Response } from 'express';
import { SkipAuth } from 'src/decorators/skip-auth';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/signIn-user.dto';
import { User } from '@prisma/client';
import { CreateVendorDto } from 'src/users/dto/create-vendor.dto';
import { AuthGuard } from '@nestjs/passport';

// Define the type to extract only the `id` and `name`
type UserData = Pick<User, 'id' | 'name'>;


@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/user')
  registerUser(@Body() user: CreateUserDto) {
    return this.authService.signUpUser(user);
  }

  @Post('register/vendor')
  registerVendor(@Body() vendor: CreateVendorDto) {
    return this.authService.signUpVendor(vendor);
  }

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

  

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirect to Google for authentication
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    console.log('user from google', req.user);
    // const token = await this.authService.signIn(req.user);

    // res.cookie('access_token', token, {
    //   maxAge: 2592000000,
    //   sameSite: true,
    //   secure: false,
    // });

    // Send user info as JSON
    return res.status(200).json({ user: req.user });
  }

  // refresh token endpoint

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
