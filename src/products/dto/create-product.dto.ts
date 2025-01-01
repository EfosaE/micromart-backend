import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsPositive,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
export enum ImgType {
  URL = 'URL',
  FILE = 'FILE',
}
class TagDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  tagType: string;
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
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags: TagDto[];
}

export type ProductType = {
  name: string;
  description?: string;
  imgType: ImgType;
  imgUrl: string; // imgUrl is needed but it can come from an uploaded file hence this type was created.
  price: number;
  quantity: number;
  tags: { name: string; tagType: string }[];
};
