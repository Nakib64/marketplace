import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateClientProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Company name cannot exceed 100 characters.' })
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Billing details cannot exceed 500 characters.' })
  billingDetails?: string;
}
