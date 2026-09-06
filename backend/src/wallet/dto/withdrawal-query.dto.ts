import { WithdrawalStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class WithdrawalQueryDto {
  @IsOptional()
  @IsEnum(WithdrawalStatus, { message: 'status must be PENDING, APPROVED, or REJECTED' })
  status?: WithdrawalStatus;
}
