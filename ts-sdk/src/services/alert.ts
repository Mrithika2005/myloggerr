import { LogRecord } from '../core/record';
import { Level } from '../core/enums';

export class AlertService {
  evaluate(record: LogRecord): void {
    if (record.level >= Level.FATAL) {
      this.triggerPagerDuty(record);
    }

    if (record.context.deadlock === true) {
      this.triggerSlack(record, "#db-alerts");
    }
  }

  private triggerPagerDuty(record: LogRecord): void {
    console.error(`[ALERT] PagerDuty firing for ${record.service}: ${record.message}`);
  }

  private triggerSlack(record: LogRecord, channel: string): void {
    console.error(`[ALERT] Slack message to ${channel}: ${record.message}`);
  }
}
