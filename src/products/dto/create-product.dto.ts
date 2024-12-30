import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
export enum ImgType {
  URL = 'URL',
  FILE = 'FILE',
}

export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ImgType)
  imgType: ImgType;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  imgUrl?: string;

  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value)) // Transform price to number
  price: number;

  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10)) // Transform quantity to number
  quantity: number;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(',').map((tag: string) => tag.trim())) // Transform tags to an array
  @IsNotEmpty()
  tags: string[];
}

export type ProductType = {
  name: string;
  description?: string;
  imgType: ImgType;
  imgUrl: string; // imgUrl is needed but it can come from an uploaded file hence this type was created.
  price: number;
  quantity: number;
  tags: string[];
};
