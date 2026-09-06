import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProposalDto {
  @IsNumber({}, { message: 'bidAmount must be a number.' })
  @Min(1, { message: 'Bid amount must be at least 1.' })
  bidAmount: number;

  @IsString()
  @IsNotEmpty({ message: 'Cover letter is required.' })
  @MinLength(30, { message: 'Cover letter must be at least 30 characters long.' })
  coverLetter: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each workHistoryId must be a valid UUID.' })
  workHistoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each portfolioItemId must be a valid UUID.' })
  @ArrayMaxSize(4, { message: 'You can attach a maximum of 4 portfolio items to a proposal.' })
  portfolioItemIds?: string[];
}
