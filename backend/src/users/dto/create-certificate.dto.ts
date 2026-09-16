import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty({ message: 'Certificate title is required.' })
  @MaxLength(150, { message: 'Title cannot exceed 150 characters.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Issuing authority is required.' })
  @MaxLength(150, { message: 'Issuer cannot exceed 150 characters.' })
  issuer: string;

  @IsDateString({}, { message: 'issueDate must be a valid ISO date string.' })
  issueDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Credential URL cannot exceed 500 characters.' })
  credentialUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Image URL cannot exceed 500 characters.' })
  imageUrl?: string;
}
