import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ProposalStatus } from '@prisma/client';

export class AdminUpdateProposalDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(ProposalStatus, { message: 'Invalid proposal status' })
  status: ProposalStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  adminNotes?: string;
}
