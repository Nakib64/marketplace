import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRefundDto {
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'reason cannot exceed 500 characters' })
  reason?: string;
}
