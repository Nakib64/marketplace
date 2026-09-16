import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty({ message: 'Institution name is required.' })
  @MaxLength(150, { message: 'Institution cannot exceed 150 characters.' })
  institution: string;

  @IsString()
  @IsNotEmpty({ message: 'Degree is required.' })
  @MaxLength(150, { message: 'Degree cannot exceed 150 characters.' })
  degree: string;

  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Field of study cannot exceed 150 characters.' })
  fieldOfStudy?: string;

  @IsDateString({}, { message: 'startDate must be a valid ISO date string.' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO date string.' })
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters.' })
  description?: string;
}
