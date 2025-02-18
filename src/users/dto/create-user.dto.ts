import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  Validate,
} from 'class-validator';
import { IsUserRole } from 'src/common/role.validator';
import { Role } from 'src/interfaces/types';

export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase()) // Transform email to lowercase
  email: string;

  @IsString()
  @Transform(({ value }) =>
    value.replace(/\b\w/g, (char: string) => char.toUpperCase())
  ) 
  name: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be one of USER' }) // Only allow USER if provided
  @Validate(IsUserRole, { message: 'Role must be USER, no other role allowed' }) // Custom validation for role
  role?: Role; // Optional, defaults to 'USER' if not provided

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
