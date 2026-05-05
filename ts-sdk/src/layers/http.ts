import { BaseRecord, LogRecord } from '../core/record';
import { Layer } from '../core/enums';

export interface HttpRecordProps extends LogRecord {
  readonly method: string;
  readonly status_code: number;
  readonly latency_ms: number;
  readonly rate_limited: boolean;
}

export class HttpRecord extends BaseRecord implements HttpRecordProps {
  readonly method: string;
  readonly status_code: number;
  readonly latency_ms: number;
  readonly rate_limited: boolean;

  constructor(data: HttpRecordProps) {
    super(data);
    this.method = data.method || 'GET';
    this.status_code = data.status_code || 200;
    this.latency_ms = data.latency_ms || 0;
    this.rate_limited = !!data.rate_limited;
    Object.freeze(this);
  }

  toDict(): Record<string, any> {
    return { ...this, layer: Layer.GATEWAY };
  }
}
