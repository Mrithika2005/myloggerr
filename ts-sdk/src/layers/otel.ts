import { BaseRecord, LogRecord } from '../core/record';
import { Layer } from '../core/enums';
import { Logger } from '../core/logger';
import { Level } from '../core/enums';

export interface OtelRecordProps extends LogRecord {
  readonly slo_burn: number | null;
  readonly sample_rate: number;
}

export class OtelRecord extends BaseRecord implements OtelRecordProps {
  readonly slo_burn: number | null;
  readonly sample_rate: number;

  constructor(data: OtelRecordProps) {
    super(data);
    this.slo_burn = data.slo_burn !== undefined ? data.slo_burn : null;
    this.sample_rate = data.sample_rate || 1.0;
    Object.freeze(this);
  }

  toDict(): Record<string, any> {
    return { ...this, layer: Layer.OBSERVABILITY };
  }
}

export class OtelLogger extends Logger<OtelRecord> {
  createRecord(message: string, level: Level, ctx: Record<string, any>): OtelRecord {
    const base = this.getBaseProps(message, level, Layer.OBSERVABILITY, ctx);
    return new OtelRecord({
      ...base,
      slo_burn: ctx.slo_burn,
      sample_rate: ctx.sample_rate || 1.0,
    });
  }
}
