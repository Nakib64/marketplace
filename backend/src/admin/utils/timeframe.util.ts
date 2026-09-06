import { AnalyticsTimeframe } from '../dto/analytics-query.dto.js';

/**
 * Calculates start threshold date from timeframe preset.
 */
export function getStartDate(timeframe?: AnalyticsTimeframe): Date | undefined {
  const now = new Date();
  switch (timeframe) {
    case AnalyticsTimeframe.LAST_24_HOURS:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case AnalyticsTimeframe.LAST_7_DAYS:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case AnalyticsTimeframe.LAST_30_DAYS:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case AnalyticsTimeframe.LAST_YEAR:
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    case AnalyticsTimeframe.ALL_TIME:
    default:
      return undefined;
  }
}
