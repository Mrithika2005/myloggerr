import { BaseRecord, LogRecord } from '../core/record';
import { Layer } from '../core/enums';
import { Logger } from '../core/logger';
import { Level } from '../core/enums';

export interface SecRecordProps extends LogRecord {
  readonly actor_id: string | null;
  readonly action: string;
  readonly cve: string | null;
}

export class SecRecord extends BaseRecord implements SecRecordProps {
  readonly actor_id: string | null;
  readonly action: string;
  readonly cve: string | null;

  constructor(data: SecRecordProps) {
    super(data);
    this.actor_id = data.actor_id || null;
    this.action = data.action || 'UNKNOWN';
    this.cve = data.cve || null;
    Object.freeze(this);
  }

  toDict(): Record<string, any> {
    return { ...this, layer: Layer.SECURITY };
  }

  toCEF(): string {
    return `CEF:0|mylogger|ts-sdk|1.0|${this.action}|${this.message}|${this.level}|actor=${this.actor_id}`;
  }
}

export class SecLogger extends Logger<SecRecord> {
  createRecord(message: string, level: Level, ctx: Record<string, any>): SecRecord {
    const base = this.getBaseProps(message, level, Layer.SECURITY, ctx);
    return new SecRecord({
      ...base,
      actor_id: ctx.actor_id || null,
      action: ctx.action || 'UNKNOWN',
      cve: ctx.cve || null,
    });
  }
}
