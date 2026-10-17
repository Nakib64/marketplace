export interface TimeBucket {
  start: Date;
  end: Date;
  label: string;
}

export function calculateDateRange(
  timeframe?: string,
  customStart?: string,
  customEnd?: string,
  months?: string,
): { startDate: Date; endDate: Date } {
  const now = new Date();

  if (customStart) {
    return {
      startDate: new Date(customStart),
      endDate: customEnd ? new Date(customEnd) : now,
    };
  }

  const start = new Date(now);
  const tf = (timeframe || '').toLowerCase().trim();

  if (months) {
    const m = parseInt(months, 10);
    if (!isNaN(m) && m > 0) {
      start.setMonth(now.getMonth() - m);
      return { startDate: start, endDate: now };
    }
  }

  switch (tf) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case '7d':
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case '3m':
      start.setMonth(now.getMonth() - 3);
      break;
    case '6m':
      start.setMonth(now.getMonth() - 6);
      break;
    case '12m':
    case '1y':
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
    case '24m':
    case '2y':
      start.setFullYear(now.getFullYear() - 2);
      break;
    case '36m':
    case '3y':
      start.setFullYear(now.getFullYear() - 3);
      break;
    case '30d':
    case '1m':
    case 'month':
    default:
      start.setDate(now.getDate() - 30);
      break;
  }

  return { startDate: start, endDate: now };
}

export function generateBuckets(startDate: Date, endDate: Date, tf: string): TimeBucket[] {
  const buckets: TimeBucket[] = [];
  const normalized = (tf || '30d').toLowerCase();

  if (normalized === '7d' || normalized === 'week') {
    // 7 daily buckets
    for (let i = 0; i < 7; i++) {
      const bStart = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const bEnd = new Date(bStart.getTime() + 24 * 60 * 60 * 1000 - 1);
      const label = bStart.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      buckets.push({ start: bStart, end: bEnd, label });
    }
    return buckets;
  }

  if (normalized === '30d' || normalized === '1m' || normalized === 'month') {
    // 10 intervals (3 days each)
    const stepMs = (endDate.getTime() - startDate.getTime()) / 10;
    for (let i = 0; i < 10; i++) {
      const bStart = new Date(startDate.getTime() + i * stepMs);
      const bEnd = new Date(startDate.getTime() + (i + 1) * stepMs - 1);
      const label = bStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      buckets.push({ start: bStart, end: bEnd, label });
    }
    return buckets;
  }

  if (normalized === '3m') {
    // 12 weekly intervals
    const stepMs = (endDate.getTime() - startDate.getTime()) / 12;
    for (let i = 0; i < 12; i++) {
      const bStart = new Date(startDate.getTime() + i * stepMs);
      const bEnd = new Date(startDate.getTime() + (i + 1) * stepMs - 1);
      const label = `W${i + 1} (${bStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
      buckets.push({ start: bStart, end: bEnd, label });
    }
    return buckets;
  }

  if (normalized === '6m') {
    // 6 monthly intervals
    const stepMs = (endDate.getTime() - startDate.getTime()) / 6;
    for (let i = 0; i < 6; i++) {
      const bStart = new Date(startDate.getTime() + i * stepMs);
      const bEnd = new Date(startDate.getTime() + (i + 1) * stepMs - 1);
      const label = bStart.toLocaleDateString('en-US', { month: 'short' });
      buckets.push({ start: bStart, end: bEnd, label });
    }
    return buckets;
  }

  if (normalized === '12m' || normalized === '1y' || normalized === 'year') {
    // 12 monthly intervals
    const stepMs = (endDate.getTime() - startDate.getTime()) / 12;
    for (let i = 0; i < 12; i++) {
      const bStart = new Date(startDate.getTime() + i * stepMs);
      const bEnd = new Date(startDate.getTime() + (i + 1) * stepMs - 1);
      const label = bStart.toLocaleDateString('en-US', { month: 'short' });
      buckets.push({ start: bStart, end: bEnd, label });
    }
    return buckets;
  }

  // 24m or 36m or longer
  const count = normalized === '24m' ? 12 : normalized === '36m' ? 12 : 8;
  const stepMs = (endDate.getTime() - startDate.getTime()) / count;
  for (let i = 0; i < count; i++) {
    const bStart = new Date(startDate.getTime() + i * stepMs);
    const bEnd = new Date(startDate.getTime() + (i + 1) * stepMs - 1);
    const label = bStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    buckets.push({ start: bStart, end: bEnd, label });
  }
  return buckets;
}
