import { IsOptional, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
