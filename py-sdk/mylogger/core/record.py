from dataclasses import dataclass, replace, field
from datetime import datetime
from enum import IntEnum
from typing import Optional, Dict, Any, List, Protocol
import uuid

class Level(IntEnum):
    DEBUG = 10
    INFO = 20
    WARN = 30
    ERROR = 40
    FATAL = 50

class Layer(IntEnum):
    PRESENTATION = 1
    GATEWAY = 2
    APPLICATION = 3
    DOMAIN = 4
    PERSISTENCE = 5
    INFRA = 6
    SECURITY = 7
    OBSERVABILITY = 8

@dataclass(frozen=True)
class LogRecord:
    message: str
    level: Level
    layer: Layer
    timestamp: datetime = field(default_factory=datetime.utcnow)
    record_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    trace_id: Optional[str] = None
    span_id: Optional[str] = None
    service: Optional[str] = None
    env: Optional[str] = None
    context: Dict[str, Any] = field(default_factory=dict)

    def enrich(self, **kwargs) -> 'LogRecord':
        return replace(self, **kwargs)

    def to_dict(self) -> Dict[str, Any]:
        d = {k: v for k, v in self.__dict__.items()}
        d['level'] = self.level.name
        d['layer'] = self.layer.name
        d['timestamp'] = self.timestamp.isoformat()
        return d
