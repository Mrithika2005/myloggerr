from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, Dict, Any, List
from .record import LogRecord, Level, Layer
from .interfaces import T

class Logger(ABC, Generic[T]):
    def __init__(self, service: str, env: str, handlers: Optional[List[Any]] = None):
        self.service = service
        self.env = env
        self.handlers = handlers or []
        self.context: Dict[str, Any] = {}

    def log(self, msg: str, level: Level, **ctx) -> None:
        record = self.create_record(msg, level, **{**self.context, **ctx})
        if self.should_handle(record):
            self.handle(record)

    def debug(self, msg: str, **ctx) -> None: self.log(msg, Level.DEBUG, **ctx)
    def info(self, msg: str, **ctx) -> None: self.log(msg, Level.INFO, **ctx)
    def warn(self, msg: str, **ctx) -> None: self.log(msg, Level.WARN, **ctx)
    def error(self, msg: str, **ctx) -> None: self.log(msg, Level.ERROR, **ctx)
    def fatal(self, msg: str, **ctx) -> None: self.log(msg, Level.FATAL, **ctx)

    def child(self, **ctx) -> 'Logger[T]':
        new_ctx = {**self.context, **ctx}
        # In a real implementation, we'd clone the logger type
        return self.__class__(self.service, self.env, self.handlers)

    @abstractmethod
    def create_record(self, msg: str, level: Level, **ctx) -> T:
        pass

    @abstractmethod
    def handle(self, record: T) -> None:
        pass

    def should_handle(self, record: T) -> bool:
        return True

    def _get_base_props(self, msg: str, level: Level, layer: Layer, **ctx) -> Dict[str, Any]:
        return {
            "message": msg,
            "level": level,
            "layer": layer,
            "service": self.service,
            "env": self.env,
            "context": ctx,
            "trace_id": ctx.get("trace_id"),
            "span_id": ctx.get("span_id"),
        }
