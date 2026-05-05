import { LogRecord } from '../core/record';
import { LogEnricher } from '../core/interfaces';

export class EnrichService {
  constructor(private enrichers: LogEnricher[]) {}

  enrich(record: LogRecord): LogRecord {
    let current = record;
    for (const enricher of this.enrichers) {
      current = enricher.enrich(current);
    }
    return current;
  }
}

export class EnvEnricher implements LogEnricher {
  constructor(private env: string) {}
  enrich(record: LogRecord): LogRecord {
    return { ...record, env: this.env };
  }
}

export class RedactEnricher implements LogEnricher {
  private patterns = [
    /[\w\.-]+@[\w\.-]+\.\w+/g, // email
    /\d{4}-\d{4}-\d{4}-\d{4}/g // credit card
  ];

  enrich(record: LogRecord): LogRecord {
    const newContext = { ...record.context };
    for (const key in newContext) {
      if (typeof newContext[key] === 'string') {
        let value = newContext[key];
        for (const pattern of this.patterns) {
          value = value.replace(pattern, '[REDACTED]');
        }
        newContext[key] = value;
      }
    }
    return { ...record, context: newContext };
  }
}
