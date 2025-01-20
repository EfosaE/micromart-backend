/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ENV } from 'src/constants';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: ENV.CLIENT_ID,
      clientSecret: ENV.CLIENT_SECRET,
      callbackURL: ENV.REDIRECT_URI,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    // console.log(profile);
    const { name, emails } = profile;
    const user = await this.authService.validateGoogleUser({
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      password: 'googleauth',
    });

    done(null, user); // Pass user to request
  }
}
