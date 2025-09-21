// payments/dto/initialize-payment.dto.ts
import { IsInt, Min } from "class-validator";

export class InitializePaymentDto {
  @IsInt()
  @Min(100) // at least ₦1 (100 kobo)
  amount: number;
}
