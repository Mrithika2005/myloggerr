import { BaseRecord, LogRecord } from '../core/record';
import { Layer } from '../core/enums';

export interface BizRecordProps extends LogRecord {
  readonly event_name: string;
  readonly entity_type: string;
  readonly entity_id: string;
  readonly saga_id: string | null;
  readonly rule_id: string | null;
  readonly prev_state: string | null;
  readonly next_state: string | null;
  readonly score: number | null;
}

export class BizRecord extends BaseRecord implements BizRecordProps {
  readonly event_name: string;
  readonly entity_type: string;
  readonly entity_id: string;
  readonly saga_id: string | null;
  readonly rule_id: string | null;
  readonly prev_state: string | null;
  readonly next_state: string | null;
  readonly score: number | null;

  constructor(data: BizRecordProps) {
    super(data);
    this.event_name = data.event_name;
    this.entity_type = data.entity_type;
    this.entity_id = data.entity_id;
    this.saga_id = data.saga_id || null;
    this.rule_id = data.rule_id || null;
    this.prev_state = data.prev_state || null;
    this.next_state = data.next_state || null;
    this.score = data.score !== undefined ? data.score : null;
    Object.freeze(this);
  }

  toDict(): Record<string, any> {
    return {
      ...this,
      layer: Layer.DOMAIN,
    };
  }
}
