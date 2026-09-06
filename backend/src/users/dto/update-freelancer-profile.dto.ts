import { IsArray, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateFreelancerProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Bio cannot exceed 1000 characters.' })
  bio?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Hourly rate must be a positive number.' })
  hourlyRate?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each skill must be a string.' })
  skills?: string[];
}
