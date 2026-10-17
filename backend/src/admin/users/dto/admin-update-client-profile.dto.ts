import { IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class AdminUpdateClientProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  billingDetails?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalJobPosts?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalSpent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalReviews?: number;
}
