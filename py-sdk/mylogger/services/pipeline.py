from typing import List, Optional
from ..core.record import LogRecord
from ..core.interfaces import LogEnricher, LogHandler, LogSampler

class PipelineService:
    def __init__(self, 
                 enrichers: List[LogEnricher],
                 sampler: Optional[LogSampler],
                 handlers: List[LogHandler]):
        self.enrichers = enrichers
        self.sampler = sampler
        self.handlers = handlers

    def run(self, record: LogRecord) -> None:
        # 1. Enrich
        for enricher in self.enrichers:
            record = enricher.enrich(record)

        # 2. Sample
        if self.sampler and not self.sampler.should_sample(record):
            return

        # 3. Handle
        for handler in self.handlers:
            handler.handle(record)
