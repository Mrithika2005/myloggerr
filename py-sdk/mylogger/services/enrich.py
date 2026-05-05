import os
import re
from contextvars import ContextVar
from typing import Optional, Dict, Any
from ..core.record import LogRecord
from ..core.interfaces import LogEnricher

_trace_ctx: ContextVar[Optional[str]] = ContextVar("trace_id", default=None)

class TraceEnricher(LogEnricher):
    def enrich(self, record: LogRecord) -> LogRecord:
        tid = _trace_ctx.get()
        return record.enrich(trace_id=tid) if tid else record

class EnvEnricher(LogEnricher):
    def enrich(self, record: LogRecord) -> LogRecord:
        # Pull from environment variables
        return record.enrich(env=os.getenv("APP_ENV", record.env))

class RedactEnricher(LogEnricher):
    def __init__(self, patterns: Optional[list] = None):
        self.patterns = patterns or [
            r'[\w\.-]+@[\w\.-]+\.\w+', # email
            r'\d{4}-\d{4}-\d{4}-\d{4}' # credit card
        ]

    def enrich(self, record: LogRecord) -> LogRecord:
        new_ctx = record.context.copy()
        for key, value in new_ctx.items():
            if isinstance(value, str):
                for pattern in self.patterns:
                    value = re.sub(pattern, "[REDACTED]", value)
                new_ctx[key] = value
        return record.enrich(context=new_ctx)
