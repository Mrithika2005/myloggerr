import { LogHandler } from './interfaces';
import { LogRecord } from './record';

export class ConsoleHandler implements LogHandler {
  async handle(record: LogRecord): Promise<void> {
    const color = this.getLevelColor(record.level);
    console.log(
      `%c[${record.layer}] ${record.message}`, 
      `color: ${color}; font-weight: bold;`,
      {
        timestamp: record.timestamp,
        level: record.level,
        record_id: record.record_id,
        context: record.context
      }
    );
  }

  async flush(): Promise<void> {
    // Console is synchronous
  }

  private getLevelColor(level: number): string {
    if (level >= 50) return '#ff0000'; // Fatal
    if (level >= 40) return '#ff4444'; // Error
    if (level >= 30) return '#ffbb33'; // Warn
    if (level >= 20) return '#00C851'; // Info
    return '#33b5e5'; // Debug
  }
}

export class ApiHandler implements LogHandler {
  private endpoint: string;

  constructor(endpoint: string = '/api/logs') {
    this.endpoint = endpoint;
  }

  async handle(record: LogRecord): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
    } catch (err) {
      console.error('Failed to send log to API:', err);
    }
  }

  async flush(): Promise<void> {
    // In a production version, we might buffer logic here
  }
}
