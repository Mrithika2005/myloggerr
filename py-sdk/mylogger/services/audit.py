from typing import Union
from ..layers.biz import BizRecord
from ..layers.sec import SecRecord

class AuditService:
    def __init__(self, storage_path: str = "./logs/audit.log"):
        self.path = storage_path

    def write_audit_record(self, record: Union[BizRecord, SecRecord]):
        # Simulated WORM (Write Once Read Many) storage
        # Real implementation would use HMAC signing
        entry = record.to_dict()
        entry["_audit_signature"] = "sha256:..." 
        with open(self.path, "a") as f:
            import json
            f.write(json.dumps(entry) + "\n")
