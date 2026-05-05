import random
from ..core.record import LogRecord
from ..core.interfaces import LogSampler

class AlwaysSampler(LogSampler):
    def should_sample(self, record: LogRecord) -> bool:
        return True

class ProbabilitySampler(LogSampler):
    def __init__(self, rate: float = 0.1):
        self.rate = rate

    def should_sample(self, record: LogRecord) -> bool:
        # High priority or errors are always kept
        if record.level >= 40:
            return True
        return random.random() < self.rate
