import { IsArray, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateFreelancerProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(120, { message: 'Title cannot exceed 120 characters.' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description cannot exceed 2000 characters.' })
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Hourly rate must be a positive number.' })
  hourlyRate?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each skill must be a string.' })
  skills?: string[];
}
