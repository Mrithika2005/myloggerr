import { BaseRecord, LogRecord } from '../core/record';
import { Layer } from '../core/enums';

export interface AppRecordProps extends LogRecord {
  readonly fn_name: string;
  readonly duration_ms: number;
  readonly cache_hit: boolean;
}

export class AppRecord extends BaseRecord implements AppRecordProps {
  readonly fn_name: string;
  readonly duration_ms: number;
  readonly cache_hit: boolean;

  constructor(data: AppRecordProps) {
    super(data);
    this.fn_name = data.fn_name || 'unknown';
    this.duration_ms = data.duration_ms || 0;
    this.cache_hit = !!data.cache_hit;
    Object.freeze(this);
  }

  toDict(): Record<string, any> {
    return { ...this, layer: Layer.APPLICATION };
  }
}
