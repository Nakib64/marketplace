import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum ModerateJobAction {
  APPROVE = 'APPROVE',
  TERMINATE = 'TERMINATE',
}

export class ModerateJobDto {
  @IsEnum(ModerateJobAction, {
    message: 'action must be either APPROVE or TERMINATE',
  })
  action: ModerateJobAction;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'adminNotes cannot exceed 500 characters' })
  adminNotes?: string;
}
