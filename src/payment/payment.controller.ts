import { BadRequestException, Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { AuthService } from "src/auth/auth.service";
import { SkipAuth } from "src/decorators/skip-auth";
import { InitializePaymentDto } from "src/payment/dto/init-transaction.dto";
import { Request } from "express";
import { User } from "src/interfaces/types";

@Controller("payment")
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private authService: AuthService
  ) {}

  @Post("initialize")
  async initialize(@Body() body: InitializePaymentDto, @Req() req: Request) {
    console.log("User making payment:", req['user']);
    const user = req['user'] as User;
    if (!user.email) {
      throw new BadRequestException("User Email is missing in request");
    }
    // console.log("Initializing payment for:", this.authService.extractUserID(req));


    return this.paymentService.initializeTransaction(user.email, body.amount);
  }

  @Get("verify")
  async verify(@Query("reference") reference: string) {
    return this.paymentService.verifyTransaction(reference);
  }

  // Paystack webhook
  @SkipAuth()
  @Post("webhook")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async webhook(@Body() body: any) {
    // Paystack sends event here (charge.success, etc.)
    // TODO: Validate signature using process.env.PAYSTACK_SECRET_KEY
    console.log("Webhook event:", body);

    if (body.event === "charge.success") {
      const reference = body.data.reference;
      console.log("Verifying transaction for reference:", reference);
      // confirm with Paystack verify API, then mark order as paid in DB
    }
    return { status: "ok" };
  }

  @Post("create")
  createPaymentRequest(@Body("email") email: string) {
    if (!email) throw new BadRequestException("Email is required!");
    return this.paymentService.createPaymentRequest(email);
  }

  @Post("customer")
  createCustomer(@Body("email") email: string) {
    return this.paymentService.getCustomer(email);
  }
}
