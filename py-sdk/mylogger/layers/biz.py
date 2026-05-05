from dataclasses import dataclass
from typing import Optional, Dict, Any
from ..core.record import LogRecord, Layer, Level
from ..core.logger import Logger

@dataclass(frozen=True)
class BizRecord(LogRecord):
    event_name: str = "unknown"
    entity_type: str = "unknown"
    entity_id: str = "0"
    saga_id: Optional[str] = None
    rule_id: Optional[str] = None
    prev_state: Optional[str] = None
    next_state: Optional[str] = None
    score: Optional[float] = None

class DomainLogger(Logger[BizRecord]):
    def create_record(self, msg: str, level: Level, **ctx) -> BizRecord:
        base = self._get_base_props(msg, level, Layer.DOMAIN, **ctx)
        return BizRecord(
            **base,
            event_name=ctx.get("event_name", "unknown"),
            entity_type=ctx.get("entity_type", "unknown"),
            entity_id=ctx.get("entity_id", "0"),
            saga_id=ctx.get("saga_id"),
            rule_id=ctx.get("rule_id"),
            prev_state=ctx.get("prev_state"),
            next_state=ctx.get("next_state"),
            score=ctx.get("score"),
        )

    def handle(self, record: BizRecord) -> None:
        # In a real implementation, this would route to the PipelineService
        for handler in self.handlers:
            handler.handle(record)

    def log_event(self, event_name: str, entity_type: str, entity_id: str, **ctx):
        self.info(f"Domain Event: {event_name}", 
                  event_name=event_name, 
                  entity_type=entity_type, 
                  entity_id=entity_id, 
                  **ctx)
