export interface QueueJob<T = any> {
  id: string;
  type: string;
  payload: T;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  processedAt?: string;
  lastError?: string;
}
