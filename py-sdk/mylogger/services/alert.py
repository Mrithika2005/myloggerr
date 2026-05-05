from ..core.record import LogRecord, Level

class AlertService:
    def evaluate(self, record: LogRecord):
        if record.level >= Level.FATAL:
            self._trigger_pagerduty(record)
        
        # Domain specific rule logic
        if record.context.get("deadlock") is True:
            self._trigger_slack(record, "#db-alerts")

    def _trigger_pagerduty(self, record: LogRecord):
        print(f"[ALERT] PagerDuty firing for {record.service}: {record.message}")

    def _trigger_slack(self, record: LogRecord, channel: str):
        print(f"[ALERT] Slack message to {channel}: {record.message}")
