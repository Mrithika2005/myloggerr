import { v4 as uuidv4 } from 'uuid';
import { Level, Layer } from '../core/enums';
import { LogRecord } from '../core/record';
import { LoggerConfig } from '../core/interfaces';

export abstract class Logger<T extends LogRecord> {
  protected config: LoggerConfig;
  protected context: Record<string, any> = {};

  constructor(config: LoggerConfig, context: Record<string, any> = {}) {
    this.config = {
      handlers: [],
      enrichers: [],
      ...config
    };
    this.context = context;
  }

  abstract createRecord(message: string, level: Level, ctx: Record<string, any>): T;
  
  protected async _run(record: T): Promise<void> {
    // 1. Enrich
    let current: LogRecord = record;
    for (const enricher of this.config.enrichers || []) {
      current = enricher.enrich(current);
    }

    // 2. Sample
    if (this.config.sampler && !this.config.sampler.shouldSample(current)) {
      return;
    }

    // 3. Handle
    for (const handler of this.config.handlers || []) {
      handler.handle(current);
    }
  }

  async debug(msg: string, ctx: Record<string, any> = {}) { await this.log(msg, Level.DEBUG, ctx); }
  async info(msg: string, ctx: Record<string, any> = {}) { await this.log(msg, Level.INFO, ctx); }
  async warn(msg: string, ctx: Record<string, any> = {}) { await this.log(msg, Level.WARN, ctx); }
  async error(msg: string, ctx: Record<string, any> = {}) { await this.log(msg, Level.ERROR, ctx); }

  protected async log(msg: string, level: Level, ctx: Record<string, any>) {
    const record = this.createRecord(msg, level, { ...this.context, ...ctx });
    await this._run(record);
  }

  protected getBaseProps(msg: string, level: Level, layer: Layer, ctx: Record<string, any>): LogRecord {
    return {
      message: msg,
      level,
      layer,
      timestamp: new Date().toISOString(),
      record_id: uuidv4(),
      trace_id: ctx.trace_id || null,
      span_id: ctx.span_id || null,
      service: this.config.service,
      env: this.config.env,
      context: ctx,
    };
  }
}
