import { IsInt, IsNotEmpty, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsUUID(4, { message: 'contractId must be a valid UUID v4' })
  contractId: string;

  @IsInt({ message: 'rating must be an integer between 1 and 5' })
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating cannot exceed 5' })
  rating: number;

  @IsString()
  @MinLength(10, { message: 'feedback must be at least 10 characters long' })
  @MaxLength(1000, { message: 'feedback cannot exceed 1000 characters' })
  feedback: string;
}
