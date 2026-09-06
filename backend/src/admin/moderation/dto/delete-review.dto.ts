import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteReviewDto {
  @IsNotEmpty({ message: 'Reason is required' })
  @IsString()
  @MinLength(5, { message: 'Reason must be at least 5 characters long' })
  @MaxLength(500, { message: 'Reason cannot exceed 500 characters' })
  reason: string;
}
