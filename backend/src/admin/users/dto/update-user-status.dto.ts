import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}
