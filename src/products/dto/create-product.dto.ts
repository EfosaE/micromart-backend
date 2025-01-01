import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { Transform} from 'class-transformer';
export enum ImgType {
  URL = 'URL',
  FILE = 'FILE',
}
type TagType = {
  name: string;

  tagType: string;
};
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
  @Transform(({ value }) => {
    // If the value is a string, assume it's a stringified array of objects
    if (typeof value === 'string') {
      try {
        // We attempt to parse the string into an actual array of objects
        const parsedTags = JSON.parse(value);
        // Ensure it's actually an array of objects
        if (Array.isArray(parsedTags)) {
          return parsedTags; // Return the parsed array of objects
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
  tags: TagType[]; // This will now correctly expect an array of TagDto objects
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
