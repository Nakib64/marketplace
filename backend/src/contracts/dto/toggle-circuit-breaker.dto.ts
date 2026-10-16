import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ToggleCircuitBreakerDto {
  @IsIn(['payouts', 'escrow', 'maintenance'], {
    message: 'type must be one of: payouts, escrow, maintenance',
  })
  type: 'payouts' | 'escrow' | 'maintenance';

  @IsBoolean()
  state: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}
