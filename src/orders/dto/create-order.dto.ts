import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsInt,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @IsString()
  @Matches(/^PROD/, {
    message: 'productId must start with "PROD"',
  })
  productId: string;

  @IsInt()
  @IsPositive()
  quantity: number;

}

export class CreateOrderDto {
  @IsUUID()
  buyerId: string;
  @IsString()
  shippingDetails: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
