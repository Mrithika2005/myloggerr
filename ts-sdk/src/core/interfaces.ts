import { LogRecord } from './record';

export interface LogEnricher {
  enrich(record: LogRecord): LogRecord;
}

export interface LogHandler {
  handle(record: LogRecord): void;
  flush(): Promise<void>;
}

export interface LogFormatter {
  format(record: LogRecord): string;
}

export interface LogSampler {
  shouldSample(record: LogRecord): boolean;
}

export interface LoggerConfig {
  service: string;
  env: string;
  handlers?: LogHandler[];
  enrichers?: LogEnricher[];
  sampler?: LogSampler;
}
