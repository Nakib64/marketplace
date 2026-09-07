import { IsOptional, IsString } from 'class-validator';

export class AdminRefreshDto {
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
