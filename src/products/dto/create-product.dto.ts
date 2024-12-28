import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
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

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  imgUrl?: string;

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
}

export type ProductType = {
  name: string;
  description?: string;
  imgUrl: string; // imgUrl is option on form submission but not on create product
  price: number;
  quantity: number;
  tags: string[];
};
