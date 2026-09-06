import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class DisputeSplitDto {
  @IsNotEmpty()
  @IsNumber({}, { message: 'clientRefundPercentage must be a number' })
  @Min(1, { message: 'clientRefundPercentage must be at least 1%' })
  @Max(99, { message: 'clientRefundPercentage cannot exceed 99%' })
  clientRefundPercentage: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: 'Arbitration notes must be at least 10 characters long' })
  @MaxLength(1000, { message: 'Arbitration notes cannot exceed 1000 characters' })
  adminNotes: string;
}
