import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWorkHistoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  @MaxLength(150, { message: 'Title cannot exceed 150 characters.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Company name is required.' })
  @MaxLength(150, { message: 'Company name cannot exceed 150 characters.' })
  company: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters.' })
  description?: string;

  @IsDateString({}, { message: 'startDate must be a valid ISO date string.' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO date string.' })
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;
}
