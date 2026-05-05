import { Level, Layer } from './enums';

export interface LogRecord {
  readonly message: string;
  readonly level: Level;
  readonly layer: Layer;
  readonly timestamp: string;
  readonly record_id: string;
  readonly trace_id: string | null;
  readonly span_id: string | null;
  readonly service: string | null;
  readonly env: string | null;
  readonly context: Record<string, any>;
}

export abstract class BaseRecord implements LogRecord {
  readonly message: string;
  readonly level: Level;
  readonly layer: Layer;
  readonly timestamp: string;
  readonly record_id: string;
  readonly trace_id: string | null;
  readonly span_id: string | null;
  readonly service: string | null;
  readonly env: string | null;
  readonly context: Record<string, any>;

  constructor(data: LogRecord) {
    this.message = data.message;
    this.level = data.level;
    this.layer = data.layer;
    this.timestamp = data.timestamp;
    this.record_id = data.record_id;
    this.trace_id = data.trace_id;
    this.span_id = data.span_id;
    this.service = data.service;
    this.env = data.env;
    this.context = { ...data.context };
    Object.freeze(this);
    Object.freeze(this.context);
  }

  abstract toDict(): Record<string, any>;
  
  enrich(update: Partial<LogRecord>): this {
    const Constructor = this.constructor as any;
    return new Constructor({ ...this, ...update });
  }
}
