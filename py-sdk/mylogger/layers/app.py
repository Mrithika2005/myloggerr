from dataclasses import dataclass
from typing import Optional, Dict, Any
from ..core.record import LogRecord, Layer, Level
from ..core.logger import Logger

@dataclass(frozen=True)
class AppRecord(LogRecord):
    fn_name: str = "unknown"
    duration_ms: float = 0.0
    cache_hit: bool = False

class AppLogger(Logger[AppRecord]):
    def create_record(self, msg: str, level: Level, **ctx) -> AppRecord:
        base = self._get_base_props(msg, level, Layer.APPLICATION, **ctx)
        return AppRecord(
            **base,
            fn_name=ctx.get("fn_name", "unknown"),
            duration_ms=ctx.get("duration_ms", 0.0),
            cache_hit=ctx.get("cache_hit", False)
        )

    def handle(self, record: AppRecord) -> None:
        for handler in self.handlers:
            handler.handle(record)
