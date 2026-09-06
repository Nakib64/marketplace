import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'reason cannot exceed 500 characters' })
  reason?: string;
}
