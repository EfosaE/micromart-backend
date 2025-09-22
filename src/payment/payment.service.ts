import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PayStackResponse } from "src/interfaces/types";

@Injectable()
export class PaymentService {
  constructor(private readonly configService: ConfigService) {}

  async initializeTransaction(email: string, amount: number) {
    try {
      const response = await fetch(
        `${this.configService.get("PAYSTACK_BASE_URL")}/transaction/initialize`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.configService.get("TEST_SECRET_KEY")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            amount: amount * 100, // Paystack expects amount in kobo
            callback_url: `${this.configService.get("REMIX_APP_URL")}/payments/callback`,
          }),
        }
      );

      const data = await response.json();
      console.log("Transaction initialized:", data);
      return data;
    } catch (error) {
      throw new HttpException(error.response?.data || "Paystack error", 400);
    }
  }

  async verifyTransaction(reference: string) {
    try {
      const response = await fetch(
        `${this.configService.get("PAYSTACK_BASE_URL")}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get("TEST_SECRET_KEY")}`,
          },
        }
      );
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw new HttpException(
        error.response?.data || "Verification error",
        400
      );
    }
  }

  async createPaymentRequest(email: string) {
    let customer: PayStackResponse;
    customer = await this.getCustomer(email);
    if (!customer.status) {
      customer = await this.createCustomer(email);
    }
    const requestData = {
      customer: customer.data.customer_code, // Customer's email
      description: "Invoice for your recent order",
      line_items: [
        {
          name: "T-Shirt", // Item name
          quantity: 2, // Quantity
          amount: 200000, // Price per unit in kobo (₦2000)
        },
        {
          name: "Cap", // Item name
          quantity: 1,
          amount: 100000, // Price per unit in kobo (₦1000)
        },
      ],
      due_date: "2025-01-20T23:59:59Z", // Optional
    };

    try {
      const response = await fetch("https://api.paystack.co/paymentrequest", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.configService.get("TEST_SECRET_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), // Convert requestData to JSON string
      });
      const data = await response.json();

      console.log("Payment Request Created:", data);
      return data;
    } catch (error) {
      console.error(error);
      console.error(
        "Error creating payment request:",
        error.response?.data || error.message
      );
    }
  }

  private async createCustomer(email: string): Promise<PayStackResponse> {
    const params = JSON.stringify({
      email,
    });

    try {
      const response = await fetch(
        `${this.configService.get("PAYSTACK_BASE_URL")}/customer`,
        {
          method: "POST", // Specify the HTTP method
          headers: {
            Authorization: `Bearer ${this.configService.get("TEST_SECRET_KEY")}`,
            "Content-Type": "application/json",
          },
          body: params, // Convert requestData to JSON string
        }
      );

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      console.error(
        "Error creating payment request:",
        error.response?.data || error.message
      );
    }
  }

  async getCustomer(email: string): Promise<PayStackResponse> {
    const response = await fetch(
      `${this.configService.get("PAYSTACK_BASE_URL")}/customer/${email}`,
      {
        method: "GET", // Specify the HTTP method
        headers: {
          Authorization: `Bearer ${this.configService.get("TEST_SECRET_KEY")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  }
}
