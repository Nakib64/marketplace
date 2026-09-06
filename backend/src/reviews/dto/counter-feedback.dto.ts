import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CounterFeedbackDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'counterFeedback must be at least 5 characters long' })
  @MaxLength(1000, { message: 'counterFeedback cannot exceed 1000 characters' })
  counterFeedback: string;
}
