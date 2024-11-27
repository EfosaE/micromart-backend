import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';


@Injectable()
export class GoogleOAuthService {
  private clientId = process.env.CLIENT_ID;
  private clientSecret = process.env.CLIENT_SECRET;
  private redirectUri = process.env.REDIRECT_URI; // or your deployed URL

  private oauth2Client = new google.auth.OAuth2(
    this.clientId,
    this.clientSecret,
    this.redirectUri
  );

  // Step 1: Generate Google OAuth URL
    getGoogleAuthUrl() {
        console.log(this.clientId);
        console.log(this.clientSecret);
        console.log(this.redirectUri);
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    });
  }

  // Step 2: Get user profile after exchanging the authorization code
  async getGoogleUserProfile(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    // Step 3: Get user info from Google
    const oauth2 = google.oauth2({
      auth: this.oauth2Client,
      version: 'v2',
    });
      const userInfo = await oauth2.userinfo.get();
      console.log(userInfo)

    return userInfo.data;
  }

  // Step 4: Generate a JWT token after authentication
  generateJwtToken(userProfile) {
    return userProfile;
    // return jwt.sign(
    //   { userId: userProfile.id, email: userProfile.email },
    //   'YOUR_SECRET_KEY',
    //   { expiresIn: '1h' }
    // );
  }
}
