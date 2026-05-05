import { Logger } from '../core/logger';
import { Level, Layer } from '../core/enums';
import { BizRecord } from './domain';

export class DomainLogger extends Logger<BizRecord> {
  createRecord(message: string, level: Level, ctx: Record<string, any>): BizRecord {
    const base = this.getBaseProps(message, level, Layer.DOMAIN, ctx);
    return new BizRecord({
      ...base,
      event_name: ctx.event_name || 'unknown_event',
      entity_type: ctx.entity_type || 'unknown_entity',
      entity_id: ctx.entity_id || '0',
      saga_id: ctx.saga_id || null,
      rule_id: ctx.rule_id || null,
      prev_state: ctx.prev_state || null,
      next_state: ctx.next_state || null,
      score: ctx.score || null,
    });
  }

  async logEvent(eventName: string, entityType: string, entityId: string, ctx: Record<string, any> = {}) {
    await this.info(`Domain Event: ${eventName}`, { 
      ...ctx, 
      event_name: eventName, 
      entity_type: entityType, 
      entity_id: entityId 
    });
  }
}
