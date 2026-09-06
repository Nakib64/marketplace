import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum Timeframe {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export class AnalyticsQueryDto {
  @IsOptional()
  @IsEnum(Timeframe)
  timeframe?: Timeframe = Timeframe.MONTH;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
