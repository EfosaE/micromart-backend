import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ENV } from 'src/constants';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    UsersModule,
    LoggerModule,
    JwtModule.register({
      global: true,
      secret: ENV.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, HashService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
