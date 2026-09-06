import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Category name is required.' })
  @MaxLength(100, { message: 'Category name cannot exceed 100 characters.' })
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
