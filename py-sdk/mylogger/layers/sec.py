from dataclasses import dataclass
from typing import Optional, Dict, Any
from ..core.record import LogRecord, Layer, Level
from ..core.logger import Logger

@dataclass(frozen=True)
class SecRecord(LogRecord):
    actor_id: Optional[str] = None
    action: str = "UNKNOWN"
    cve: Optional[str] = None

    def to_cef(self) -> str:
        # Simplified Common Event Format
        return f"CEF:0|mylogger|sec-sdk|1.0|{self.action}|{self.message}|{self.level}|actor={self.actor_id}"

class SecLogger(Logger[SecRecord]):
    def create_record(self, msg: str, level: Level, **ctx) -> SecRecord:
        base = self._get_base_props(msg, level, Layer.SECURITY, **ctx)
        return SecRecord(
            **base,
            actor_id=ctx.get("actor_id"),
            action=ctx.get("action", "UNKNOWN"),
            cve=ctx.get("cve")
        )

    def handle(self, record: SecRecord) -> None:
        # Security records are NEVER sampled and often written synchronously
        for handler in self.handlers:
            handler.handle(record)

    def should_handle(self, record: SecRecord) -> bool:
        return True # Security events always handled
