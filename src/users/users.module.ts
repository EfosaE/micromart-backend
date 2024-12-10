import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerModule } from 'src/logger/logger.module';
import { MailModule } from 'src/common/mail/mail.module';

@Module({
  imports: [LoggerModule, MailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
