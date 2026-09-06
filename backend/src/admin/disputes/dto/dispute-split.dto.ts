import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class DisputeSplitDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(99)
  clientRefundPercentage: number;

  @IsNotEmpty()
  @IsString()
  adminNotes: string;
}
