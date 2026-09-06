import { IsNumber, Max, Min } from 'class-validator';

export class UpdatePlatformFeeDto {
  @IsNumber({}, { message: 'platformFeePercentage must be a number' })
  @Min(0, { message: 'platformFeePercentage cannot be negative' })
  @Max(100, { message: 'platformFeePercentage cannot exceed 100%' })
  platformFeePercentage: number;
}
