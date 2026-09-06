import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'Job title is required.' })
  @MinLength(5, { message: 'Title must be at least 5 characters long.' })
  @MaxLength(150, { message: 'Title cannot exceed 150 characters.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Job description is required.' })
  @MinLength(20, { message: 'Description must be at least 20 characters long.' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Job category is required.' })
  @MaxLength(100, { message: 'Category cannot exceed 100 characters.' })
  category: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Sub-category cannot exceed 100 characters.' })
  subCategory?: string;

  @IsNumber({}, { message: 'Budget must be a number.' })
  @Min(1, { message: 'Budget must be at least 1.' })
  budget: number;

  @IsArray({ message: 'Skills must be an array of strings.' })
  @ArrayMinSize(1, { message: 'At least one skill is required.' })
  @IsString({ each: true, message: 'Each skill must be a string.' })
  skills: string[];
}
