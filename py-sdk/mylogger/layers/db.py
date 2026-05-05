from dataclasses import dataclass
from typing import Optional, Dict, Any
import hashlib
from ..core.record import LogRecord, Layer, Level
from ..core.logger import Logger

@dataclass(frozen=True)
class DbRecord(LogRecord):
    query_hash: str = ""
    slow_flag: bool = False
    tx_id: Optional[str] = None

class DbLogger(Logger[DbRecord]):
    def create_record(self, msg: str, level: Level, **ctx) -> DbRecord:
        base = self._get_base_props(msg, level, Layer.PERSISTENCE, **ctx)
        sql = ctx.get("sql", "")
        query_hash = hashlib.sha256(sql.encode()).hexdigest() if sql else ""
        
        return DbRecord(
            **base,
            query_hash=query_hash,
            slow_flag=ctx.get("duration_ms", 0) > ctx.get("slow_threshold", 200),
            tx_id=ctx.get("tx_id")
        )

    def handle(self, record: DbRecord) -> None:
        # DbLogger might skip non-slow queries if configured
        for handler in self.handlers:
            handler.handle(record)
