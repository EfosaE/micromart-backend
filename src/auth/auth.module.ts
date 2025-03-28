import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { GoogleStrategy } from './google.strategy';


@Module({
  imports: [
    UsersModule,
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, HashService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
