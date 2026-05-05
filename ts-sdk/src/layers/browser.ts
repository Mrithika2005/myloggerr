import { Logger } from '../core/logger';
import { Level, Layer } from '../core/enums';
import { UIRecord } from './ui';

export class BrowserLogger extends Logger<UIRecord> {
  createRecord(message: string, level: Level, ctx: Record<string, any>): UIRecord {
    const base = this.getBaseProps(message, level, Layer.PRESENTATION, ctx);
    return new UIRecord({
      ...base,
      event_type: ctx.event_type || 'click',
      vitals: ctx.vitals || {},
      variant: ctx.variant || null,
    });
  }

  async logClick(elementId: string, ctx: Record<string, any> = {}) {
    await this.info(`User clicked ${elementId}`, { ...ctx, event_type: 'click', element_id: elementId });
  }

  async logNavigation(from: string, to: string, ctx: Record<string, any> = {}) {
    await this.info(`Navigation: ${from} -> ${to}`, { ...ctx, event_type: 'navigation', from, to });
  }
}
