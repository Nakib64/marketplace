import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReplyProposalDto {
  @IsNotEmpty({ message: 'Message content is required' })
  @IsString()
  @MaxLength(3000, { message: 'Message content cannot exceed 3000 characters' })
  message: string;
}
