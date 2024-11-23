import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsUUID,
  IsInt,
  IsPositive,
} from 'class-validator';

export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  @IsNotEmpty()
  tags: string[];

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
