from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List, Optional, Dict, Any, Protocol, runtime_checkable
from .record import LogRecord

T = TypeVar("T", bound=LogRecord)

@runtime_checkable
class LogEnricher(Protocol):
    def enrich(self, record: LogRecord) -> LogRecord:
        ...

@runtime_checkable
class LogHandler(Protocol):
    def handle(self, record: LogRecord) -> None:
        ...
    def flush(self, batch: List[LogRecord]) -> None:
        ...

@runtime_checkable
class LogFormatter(Protocol):
    def format(self, record: LogRecord) -> str:
        ...

@runtime_checkable
class LogSampler(Protocol):
    def should_sample(self, record: LogRecord) -> bool:
        ...
