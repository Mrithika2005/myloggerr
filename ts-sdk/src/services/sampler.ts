import { LogRecord } from '../core/record';
import { LogSampler } from '../core/interfaces';
import { Level } from '../core/enums';

export class SamplerService {
  constructor(private sampler: LogSampler) {}

  shouldSample(record: LogRecord): boolean {
    return this.sampler.shouldSample(record);
  }
}

export class AlwaysSampler implements LogSampler {
  shouldSample(): boolean {
    return true;
  }
}

export class ProbabilitySampler implements LogSampler {
  constructor(private rate: number = 0.1) {}

  shouldSample(record: LogRecord): boolean {
    if (record.level >= Level.ERROR) return true;
    return Math.random() < this.rate;
  }
}
