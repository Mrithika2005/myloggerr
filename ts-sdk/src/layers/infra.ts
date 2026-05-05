import { BaseRecord, LogRecord } from '../core/record';
import { Layer } from '../core/enums';
import { Logger } from '../core/logger';
import { Level } from '../core/enums';

export interface InfraRecordProps extends LogRecord {
  readonly metric_name: string;
  readonly metric_value: number;
  readonly node_id: string | null;
}

export class InfraRecord extends BaseRecord implements InfraRecordProps {
  readonly metric_name: string;
  readonly metric_value: number;
  readonly node_id: string | null;

  constructor(data: InfraRecordProps) {
    super(data);
    this.metric_name = data.metric_name || 'unknown_metric';
    this.metric_value = data.metric_value || 0;
    this.node_id = data.node_id || null;
    Object.freeze(this);
  }

  toDict(): Record<string, any> {
    return { ...this, layer: Layer.INFRA };
  }
}

export class InfraLogger extends Logger<InfraRecord> {
  createRecord(message: string, level: Level, ctx: Record<string, any>): InfraRecord {
    const base = this.getBaseProps(message, level, Layer.INFRA, ctx);
    return new InfraRecord({
      ...base,
      metric_name: ctx.metric_name || '',
      metric_value: ctx.metric_value || 0,
      node_id: ctx.node_id || null,
    });
  }
}
