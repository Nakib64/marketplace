import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Sub-category name is required.' })
  @MaxLength(100, { message: 'Sub-category name cannot exceed 100 characters.' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Slug cannot exceed 100 characters.' })
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters.' })
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
