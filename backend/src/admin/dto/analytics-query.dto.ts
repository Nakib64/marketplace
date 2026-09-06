import { IsEnum, IsOptional } from 'class-validator';

export enum AnalyticsTimeframe {
  LAST_24_HOURS = '24h',
  LAST_7_DAYS = '7d',
  LAST_30_DAYS = '30d',
  LAST_YEAR = 'year',
  ALL_TIME = 'all',
}

export class AnalyticsQueryDto {
  @IsOptional()
  @IsEnum(AnalyticsTimeframe, {
    message: 'timeframe must be 24h, 7d, 30d, year, or all',
  })
  timeframe?: AnalyticsTimeframe = AnalyticsTimeframe.ALL_TIME;
}
