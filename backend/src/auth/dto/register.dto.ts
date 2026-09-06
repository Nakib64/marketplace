import { Role } from '@prisma/client';
import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @IsIn([Role.CLIENT, Role.FREELANCER], {
    message: 'Role must be either CLIENT or FREELANCER.',
  })
  role: Role;
}
