import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class DisputeResolutionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: 'Arbitration notes must be at least 10 characters long' })
  @MaxLength(1000, { message: 'Arbitration notes cannot exceed 1000 characters' })
  adminNotes: string;
}
