import { BaseRecord, LogRecord } from '../core/record';
import { Layer } from '../core/enums';

export interface UIRecordProps extends LogRecord {
  readonly event_type: string;
  readonly vitals: Record<string, any>;
  readonly variant: string | null;
}

export class UIRecord extends BaseRecord implements UIRecordProps {
  readonly event_type: string;
  readonly vitals: Record<string, any>;
  readonly variant: string | null;

  constructor(data: UIRecordProps) {
    super(data);
    this.event_type = data.event_type;
    this.vitals = { ...data.vitals };
    this.variant = data.variant || null;
    Object.freeze(this);
    Object.freeze(this.vitals);
  }

  toDict(): Record<string, any> {
    return {
      ...this,
      layer: Layer.PRESENTATION,
    };
  }
}
