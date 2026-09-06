import { IsNotEmpty, IsUUID } from 'class-validator';

export class AcceptProposalDto {
  @IsNotEmpty()
  @IsUUID(4, { message: 'proposalId must be a valid UUID v4' })
  proposalId: string;
}
