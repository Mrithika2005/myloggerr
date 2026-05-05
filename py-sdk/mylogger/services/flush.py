import asyncio
import atexit
import json
from collections import deque
from typing import List
from ..core.record import LogRecord
from ..core.interfaces import LogHandler

class FlushService:
    def __init__(self, handler: LogHandler, batch_size: int = 100, interval_s: float = 5.0):
        self._buf = deque(maxlen=batch_size)
        self._handler = handler
        self._interval = interval_s
        self._dlq_path = "./logs/dlq.ndjson"
        
        # In a real app, we'd start a background task
        # asyncio.create_task(self._periodic_flush())
        atexit.register(self._flush_sync)

    def add(self, record: LogRecord):
        self._buf.append(record)
        if len(self._buf) >= self._buf.maxlen:
            asyncio.create_task(self._flush())

    async def _flush(self):
        if not self._buf:
            return
        
        batch = list(self._buf)
        self._buf.clear()
        
        for attempt in range(3):
            try:
                self._handler.flush(batch)
                return
            except Exception:
                await asyncio.sleep(2 ** attempt)
        
        self._write_dlq(batch)

    def _flush_sync(self):
        if not self._buf:
            return
        batch = list(self._buf)
        self._buf.clear()
        try:
            self._handler.flush(batch)
        except Exception:
            self._write_dlq(batch)

    def _write_dlq(self, batch: List[LogRecord]):
        with open(self._dlq_path, "a") as f:
            for record in batch:
                f.write(json.dumps(record.to_dict()) + "\n")
