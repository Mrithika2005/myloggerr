from dataclasses import dataclass
from typing import Optional, Dict, Any
from ..core.record import LogRecord, Layer, Level
from ..core.logger import Logger

@dataclass(frozen=True)
class HttpRecord(LogRecord):
    method: str = "GET"
    status_code: int = 200
    rate_limited: bool = False
    bot_score: Optional[float] = None

class GatewayLogger(Logger[HttpRecord]):
    def create_record(self, msg: str, level: Level, **ctx) -> HttpRecord:
        base = self._get_base_props(msg, level, Layer.GATEWAY, **ctx)
        return HttpRecord(
            **base,
            method=ctx.get("method", "GET"),
            status_code=ctx.get("status_code", 200),
            rate_limited=ctx.get("rate_limited", False),
            bot_score=ctx.get("bot_score")
        )

    def handle(self, record: HttpRecord) -> None:
        for handler in self.handlers:
            handler.handle(record)
