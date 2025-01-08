import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsPositive,
  IsEnum,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { Transform } from 'class-transformer';
export enum ImgType {
  URL = 'URL',
  FILE = 'FILE',
}

export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    value.replace(/\b\w/g, (char: string) => char.toUpperCase())
  )
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

  @Transform(({ value }) => {
    // it's a stringified array of numbers
    if (typeof value === 'string') {
      try {
        // We attempt to parse the string into an actual array of objects
        const parsedTags = JSON.parse(value);
        // Ensure it's actually an array of objects
        if (Array.isArray(parsedTags)) {
          console.log(
            parsedTags,
            parsedTags.map((tag) => parseInt(tag, 10))
          );
          return parsedTags
        } else {
          throw new Error('Parsed value is not an array');
        }
      } catch (err) {
        console.log('Error parsing tags:', err);
        return []; // If parsing fails, return an empty array
      }
    }
    return value; // If the value is already an array, return as is
  })
  @IsArray()
  @ArrayMinSize(1) // Minimum of 1 item in the array
  @ArrayMaxSize(10) // Maximum of 10 items in the array
  @IsInt({ each: true }) // Ensure each element in the array is an integer
  tags: number[];
}

export type ProductType = {
  name: string;
  description?: string;
  imgType: ImgType;
  imgUrl: string; // imgUrl is needed but it can come from an uploaded file hence this type was created.
  price: number;
  quantity: number;
  tags: number[];
};
