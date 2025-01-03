import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { IsVendorRole } from 'src/common/role.validator';
import { Role } from 'src/interfaces/types';

export class CreateVendorDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase()) // Transform email to lowercase
  email: string;

  @IsString()
  @Transform(({ value }) =>
    value.replace(/\b\w/g, (char: string) => char.toUpperCase())
  )
  name: string;

  @IsEnum(Role, { message: 'Role must be of VENDOR' }) // Only allow USER if provided
  @Validate(IsVendorRole, {
    message: 'Role must be VENDOR, no other role allowed',
  }) // Custom validation for role
  role: Role;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value)) // Transform price to number
  categoryId: number;

  @IsString()
  @Transform(({ value }) =>
    value.replace(/\b\w/g, (char: string) => char.toUpperCase())
  )
  @MinLength(3, { message: 'Business name must be at least 3 characters long' })
  businessName: string;
}
