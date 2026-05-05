import { BizRecord } from '../layers/domain';
import { SecRecord } from '../layers/sec';

export class AuditService {
  async writeAuditRecord(record: BizRecord | SecRecord): Promise<void> {
    const entry = record.toDict();
    entry._audit_signature = "sha256:ts-signed";
    
    // In browser, this would typically be a secure POST
    console.warn('[AUDIT] Immutable WORM Write (Simulated)', entry);
  }
}