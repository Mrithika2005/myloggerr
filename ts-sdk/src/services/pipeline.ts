import { LogRecord } from '../core/record';
import { LogEnricher, LogSampler, LogHandler } from '../core/interfaces';

export class PipelineService {
  constructor(
    private enrichers: LogEnricher[],
    private sampler: LogSampler | null,
    private handlers: LogHandler[]
  ) {}

  async run(record: LogRecord): Promise<void> {
    // 1. Enrich
    let current = record;
    for (const enricher of this.enrichers) {
      current = enricher.enrich(current);
    }

    // 2. Sample
    if (this.sampler && !this.sampler.shouldSample(current)) {
      return;
    }

    // 3. Handle
    for (const handler of this.handlers) {
      handler.handle(current);
    }
  }
}
