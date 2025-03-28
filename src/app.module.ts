import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./users/users.module";
import { LoggerModule } from "./logger/logger.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";
import { OrdersModule } from "./orders/orders.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MailModule } from "./common/mail/mail.module";
import { CloudinaryModule } from "./common/cloudinary/cloudinary.module";
import { AuthGuard } from "./auth/auth.guard";
import { PaymentModule } from "./payment/payment.module";
import * as Joi from "joi";
import { JwtModule } from "@nestjs/jwt";

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
    MailModule,
    CloudinaryModule,
     JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      global: true, // ✅ Makes JwtService available everywhere
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().default(4000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        REFRESH_TOKEN: Joi.string().required(),
        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET: Joi.string().required(),
        REDIRECT_URI: Joi.string().uri().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASS: Joi.string().required(),
        EMAIL_FROM: Joi.string().required(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        OPTIMIZE_API_KEY: Joi.string().required(),
        TEST_SECRET_KEY: Joi.string().required(),
        PAYSTACK_BASE_URL: Joi.string().required(),
        REMIX_APP_URL: Joi.string().required(),
        NEST_API_URL: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true, //  Prevents errors from system variables
        abortEarly: true, // Stops validation at first error
      },
    }),

    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000,
        limit: 3,
      },
      {
        name: "medium",
        ttl: 10000,
        limit: 20,
      },
      {
        name: "long",
        ttl: 60000,
        limit: 100,
      },
    ]),
    PaymentModule,
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
