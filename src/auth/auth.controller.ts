import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Redirect,
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
import { GoogleAuthGuard } from './google.guard';
import { ConfigService } from '@nestjs/config';



// Define the type to extract only the `id` and `name`
type UserData = Pick<User, 'id' | 'name'>;

@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

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
  @Redirect()
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req: Request,
    @Query() query: { error?: string }
  ) {

    if (query.error) {
      // Handle the error, e.g., "access_denied"
      return {
        url: `${this.configService.get("REMIX_APP_URL")}/login?error=${query.error}`,
      };
    }

    if (!req.user) {
      throw new UnauthorizedException(
        'Authentication failed or user data is missing.'
      );
    }

    const user = req.user as User;
    if (!user?.id || !user?.name || !user?.activeRole) {
      throw new UnauthorizedException('Invalid user data.');
    }

    let token: string;
    try {
      token = await this.authService.createAccessToken({
        id: user.id,
        name: user.name,
        activeRole: user.activeRole,
      });
    } catch (err) {
      console.error('Error generating access token:', err);
      throw new InternalServerErrorException(
        'Failed to generate access token.'
      );
    }

    // Handle successful login
    return {
      url: `${this.configService.get("REMIX_APP_URL")}/callback?token=${encodeURIComponent(token)}`,
    };
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
