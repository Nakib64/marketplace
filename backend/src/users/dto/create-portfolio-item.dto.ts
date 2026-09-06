import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreatePortfolioImageDto {
  @IsUrl({}, { message: 'imageUrl must be a valid URL string.' })
  imageUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Image subtitle cannot exceed 150 characters.' })
  subtitle?: string;
}

export class CreatePortfolioItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Portfolio title is required.' })
  @MinLength(3, { message: 'Title must be at least 3 characters long.' })
  @MaxLength(150, { message: 'Title cannot exceed 150 characters.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Portfolio details are required.' })
  @MinLength(10, { message: 'Details must be at least 10 characters long.' })
  details: string;

  @IsOptional()
  @IsUrl({}, { message: 'liveLink must be a valid URL string.' })
  liveLink?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePortfolioImageDto)
  @ArrayMaxSize(7, { message: 'A portfolio project can contain a maximum of 7 images.' })
  images: CreatePortfolioImageDto[];
}
