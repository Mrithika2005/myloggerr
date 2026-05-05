import json
from typing import List
from ..core.record import LogRecord
from ..core.interfaces import LogHandler

class FileHandler(LogHandler):
    def __init__(self, path: str):
        self.path = path

    def handle(self, record: LogRecord) -> None:
        data = record.to_dict()
        
        ts = data.get('timestamp', 'N/A')
        level_val = data.get('level', 0)
        level = 'INFO' if level_val == 20 else 'ERROR' if level_val >= 40 else 'LOG'
        layer = str(data.get('layer', 'infra')).upper()
        msg = data.get('message', '')
        
        line = f"[{ts}] [{level}] [{layer}] {msg}\n"
        
        if 'event_name' in data:
            line += f"  ✨ EVENT: {data['event_name']}\n"
            line += f"  📦 ENTITY: {data.get('entity_type')} ({data.get('entity_id')})\n"
        
        if data.get('prev_state') or data.get('next_state'):
            line += f"  🔄 STATE: {data.get('prev_state', '?')} ⮕ {data.get('next_state', '?')}\n"
            
        # Context cleaning
        meta = {k: v for k, v in data.items() if k not in [
            'message', 'timestamp', 'level', 'layer', 'event_name', 
            'entity_type', 'entity_id', 'prev_state', 'next_state',
            'record_id', 'service', 'env'
        ]}
        
        if meta:
            line += f"  📝 CONTEXT: {meta}\n"
            
        line += f"  🆔 ID: {data.get('record_id')} | 🌐 {data.get('service')}:{data.get('env')}\n"
        line += "-" * 80 + "\n"

        with open(self.path, "a") as f:
            f.write(line)

    def flush(self, batch: List[LogRecord]) -> None:
        with open(self.path, "a") as f:
            for record in batch:
                # Use handle logic internally or replicate it
                data = record.to_dict()
                timestamp = data.get('timestamp', 'N/A')
                level_val = data.get('level', 0)
                level = 'INFO' if level_val == 20 else 'ERROR' if level_val >= 40 else 'LOG'
                layer = data.get('layer', 'UNKNOWN')
                msg = data.get('message', '')
                
                log_line = f"[{timestamp}] [{level}] [{layer}] {msg}\n"
                if 'event_name' in data:
                    log_line += f"  Event: {data['event_name']} ({data.get('entity_type')} ID: {data.get('entity_id')})\n"
                if 'context' in data and data['context']:
                    log_line += f"  Context: {data['context']}\n"
                log_line += f"  Record ID: {data.get('record_id')}\n"
                log_line += "-" * 50 + "\n"
                f.write(log_line)
