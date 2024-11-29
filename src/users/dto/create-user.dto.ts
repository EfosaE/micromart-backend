import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from 'src/interfaces/types';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsEnum(UserRole, { message: 'Role must be one of: ADMIN, USER, SELLER' })
  role: UserRole;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
