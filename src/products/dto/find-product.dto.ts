import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductQueryDto {
  @ApiPropertyOptional({
    description: 'Comma-separated tags to filter by',
    type: String,
    example: 'electronics,audio',
  })
  @IsOptional()
  @IsArray() // Ensure it's an array
  @IsString({ each: true }) // Ensure each element in the array is a string
  @Transform(({ value }) => value.split(',')) // Transform comma-separated string into an array
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Minimum price for filtering',
    type: Number,
    example: 45000,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value)) // Transform to a number
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price for filtering',
    type: Number,
    example: 200000,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value)) // Transform to a number
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'limit for filtering',
    type: Number,
    example: 4,
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10)) 
  limit: number;
}
