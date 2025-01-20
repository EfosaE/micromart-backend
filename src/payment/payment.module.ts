import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
   imports: [AuthModule, LoggerModule, ProductsModule],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
