import { IsEmail, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @IsEmail({}, { message: 'Please provide a valid staff email address.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}
