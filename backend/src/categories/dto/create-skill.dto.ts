import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty({ message: 'Skill name is required.' })
  @MaxLength(100, { message: 'Skill name cannot exceed 100 characters.' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Slug cannot exceed 100 characters.' })
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Category grouping cannot exceed 100 characters.' })
  category?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
