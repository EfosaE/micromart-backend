import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { GoogleOAuthService } from './googleoauth.service';
import { Response } from 'express';
import { SkipAuth } from 'src/decorators/skip-auth';

@SkipAuth()
@Controller('auth/google')
export class GoogleOAuthController {
  constructor(private readonly googleOAuthService: GoogleOAuthService) {}

  // Step 1: Redirect to Google OAuth
  @Get()
  @Redirect()
  async googleAuth() {
    const authUrl = this.googleOAuthService.getGoogleAuthUrl();
    return { url: authUrl }; // Automatically redirects to the URL
  }

  // Step 2: Callback handler from Google
  @Get('callback')
  async googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const userProfile =
        await this.googleOAuthService.getGoogleUserProfile(code);

      //   // Step 3: Generate JWT for the authenticated user
      //   const jwtToken = this.googleOAuthService.generateJwtToken(userProfile);

      // Step 4: Send JWT back to client
      res.json({ profile: userProfile });
    } catch (error) {
      console.log(error);
      res.status(500).send('Authentication failed');
    }
  }
}
