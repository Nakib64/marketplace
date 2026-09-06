import { Timeframe } from '../dto/analytics-query.dto.js';

export function calculateDateRange(
  timeframe?: Timeframe,
  customStart?: string,
  customEnd?: string,
): { startDate?: Date; endDate?: Date } {
  const now = new Date();

  if (timeframe === Timeframe.CUSTOM && customStart) {
    return {
      startDate: new Date(customStart),
      endDate: customEnd ? new Date(customEnd) : now,
    };
  }

  const start = new Date(now);
  switch (timeframe) {
    case Timeframe.TODAY:
      start.setHours(0, 0, 0, 0);
      break;
    case Timeframe.WEEK:
      start.setDate(now.getDate() - 7);
      break;
    case Timeframe.YEAR:
      start.setFullYear(now.getFullYear() - 1);
      break;
    case Timeframe.MONTH:
    default:
      start.setDate(now.getDate() - 30);
      break;
  }

  return { startDate: start, endDate: now };
}
