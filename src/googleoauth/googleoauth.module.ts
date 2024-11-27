import { Module } from '@nestjs/common';
import { GoogleOAuthController } from './googleoauth.controller';
import { GoogleOAuthService } from './googleoauth.service';

@Module({
  controllers: [GoogleOAuthController],
  providers: [GoogleOAuthService],
})
export class GoogleOAuthModule {}
