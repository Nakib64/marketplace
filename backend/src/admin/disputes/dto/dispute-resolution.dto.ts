import { IsNotEmpty, IsString } from 'class-validator';

export class DisputeResolutionDto {
  @IsNotEmpty()
  @IsString()
  adminNotes: string;
}
