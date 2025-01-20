import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthService } from 'src/auth/auth.service';
import { SkipAuth } from 'src/decorators/skip-auth';


@SkipAuth()
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private authService: AuthService
  ) {}

  @Post('create')
  createPaymentRequest(@Body('email') email: string) {
    if (!email) throw new BadRequestException('Email is required!');
    return this.paymentService.createPaymentRequest(email);
  }

  @Post('customer')
  createCustomer(@Body('email') email: string) {
    return this.paymentService.getCustomer(email);
  }
}
