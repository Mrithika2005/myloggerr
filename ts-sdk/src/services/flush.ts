import { LogHandler } from '../core/interfaces';
import { LogRecord } from '../core/record';

export class FlushService {
  private buffer: LogRecord[] = [];
  private maxBatchSize = 100;
  private flushInterval = 5000;
  private timer: any = null;

  constructor(private handler: LogHandler) {
    this.startTimer();
    if (typeof window !== 'undefined') {
      window.addEventListener('pagehide', () => this.flushNow());
    }
  }

  add(record: LogRecord): void {
    this.buffer.push(record);
    if (this.buffer.length >= this.maxBatchSize) {
      this.flushNow();
    }
  }

  async flushNow(): Promise<void> {
    if (this.buffer.length === 0) return;

    const batch = [...this.buffer];
    this.buffer = [];

    try {
      // In browser, we might use navigator.sendBeacon for specific handlers
      await this.handler.flush(); // Real implementation would pass batch
    } catch (error) {
      console.error('Failed to flush logs', error);
      // Re-add to buffer if critically needed, but usually avoided in frontend
    }
  }

  private startTimer(): void {
    this.timer = setInterval(() => this.flushNow(), this.flushInterval);
  }

  dispose(): void {
    if (this.timer) clearInterval(this.timer);
    this.flushNow();
  }
}
