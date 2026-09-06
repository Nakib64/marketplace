import { MessageType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  @MaxLength(3000, { message: 'Message content cannot exceed 3000 characters' })
  content: string;

  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType = MessageType.TEXT;
}
