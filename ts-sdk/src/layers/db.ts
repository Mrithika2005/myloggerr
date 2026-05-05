import { BaseRecord, LogRecord } from '../core/record';
import { Layer } from '../core/enums';
import { Logger } from '../core/logger';
import { Level } from '../core/enums';

export interface DbRecordProps extends LogRecord {
  readonly query_hash: string;
  readonly slow_flag: boolean;
  readonly tx_id: string | null;
}

export class DbRecord extends BaseRecord implements DbRecordProps {
  readonly query_hash: string;
  readonly slow_flag: boolean;
  readonly tx_id: string | null;

  constructor(data: DbRecordProps) {
    super(data);
    this.query_hash = data.query_hash || '';
    this.slow_flag = !!data.slow_flag;
    this.tx_id = data.tx_id || null;
    Object.freeze(this);
  }

  toDict(): Record<string, any> {
    return { ...this, layer: Layer.PERSISTENCE };
  }
}

export class DbLogger extends Logger<DbRecord> {
  createRecord(message: string, level: Level, ctx: Record<string, any>): DbRecord {
    const base = this.getBaseProps(message, level, Layer.PERSISTENCE, ctx);
    return new DbRecord({
      ...base,
      query_hash: ctx.query_hash || '',
      slow_flag: ctx.duration_ms > (ctx.slow_threshold || 200),
      tx_id: ctx.tx_id || null,
    });
  }
}
