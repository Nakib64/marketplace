import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QueueWorkerRunnerService {
  private readonly logger = new Logger(QueueWorkerRunnerService.name);
  private isRunning = false;
  private timer: NodeJS.Timeout | null = null;

  start(name: string, pollFn: () => Promise<void>, intervalMs = 500) {
    if (this.isRunning) return;
    this.isRunning = true;

    const loop = async () => {
      if (!this.isRunning) return;
      try {
        await pollFn();
      } catch (err: any) {
        this.logger.error(`[${name}] Worker loop error: ${err.message}`);
      } finally {
        if (this.isRunning) {
          this.timer = setTimeout(loop, intervalMs);
        }
      }
    };

    this.timer = setTimeout(loop, 100);
  }

  stop() {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  isActive(): boolean {
    return this.isRunning;
  }
}
