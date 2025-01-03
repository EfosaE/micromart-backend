import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { IsVendorRole } from 'src/common/role.validator';
import { Role } from 'src/interfaces/types';


export class CreateVendorDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsEnum(Role, { message: 'Role must be of VENDOR' }) // Only allow USER if provided
  @Validate(IsVendorRole, {
    message: 'Role must be VENDOR, no other role allowed',
  }) // Custom validation for role
  role: Role;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
  @IsString()
  categoryName: string;

  @IsString()
  @MinLength(3, { message: 'Business name must be at least 3 characters long' })
  businessName: string;
}
