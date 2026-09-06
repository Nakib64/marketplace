import { WithdrawalMethod } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, Matches, Min } from 'class-validator';

export class RequestWithdrawalDto {
  @IsNotEmpty()
  @IsNumber({}, { message: 'amount must be a number' })
  @Min(500, { message: 'Minimum withdrawal amount is 500 BDT' })
  amount: number;

  @IsNotEmpty()
  @IsEnum(WithdrawalMethod, { message: 'method must be either BKASH or NAGAD' })
  method: WithdrawalMethod;

  @IsNotEmpty()
  @Matches(/^01[3-9]\d{8}$/, {
    message: 'accountNumber must be a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX)',
  })
  accountNumber: string;
}
