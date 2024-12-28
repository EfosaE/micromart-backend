import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { GoogleOAuthModule } from './googleoauth/googleoauth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './common/mail/mail.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    LoggerModule,
    EventEmitterModule.forRoot(), // Initialize the event emitter
    AuthModule,
    ProductsModule,
    OrdersModule,
    GoogleOAuthModule,
    MailModule,
    CloudinaryModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally but I didnt use the config service tho. process.env >>>>
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
