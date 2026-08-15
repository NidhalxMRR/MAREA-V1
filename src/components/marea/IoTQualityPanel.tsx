import { Panel, PanelHeader, SourceNote, StatusChip } from "./primitives";
import { cn } from "@/lib/utils";

const CHECKS = [
  { label: "Reading freshness", detail: "Age of the most recent transmission" },
  { label: "Missing readings", detail: "Gaps against the expected ~15 min cadence" },
  { label: "Duplicate timestamps", detail: "Repeated transmissions for the same instant" },
  { label: "Implausible jumps", detail: "Physically impossible step changes" },
  { label: "Frozen sensor", detail: "Identical value repeating beyond tolerance" },
  { label: "Position reported", detail: "GPS coordinates present on each reading" },
  { label: "Connectivity", detail: "Heartbeat and transmission success rate" },
];

export function IoTQualityPanel({ className }: { className?: string }) {
  return (
    <Panel className={cn("overflow-hidden", className)}>
      <PanelHeader
        eyebrow="Reading quality"
        title="Data checks"
        description="Every incoming reading passes these checks before MAREA uses it for monitoring, comparison or retraining."
        actions={<StatusChip tone="pending">Idle</StatusChip>}
      />
      <ul className="divide-y divide-border">
        {CHECKS.map((check) => (
          <li
            key={check.label}
            className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{check.label}</p>
              <p className="text-xs text-muted-foreground">{check.detail}</p>
            </div>
            <span aria-hidden className="tabular text-sm text-border-strong sm:text-right">
              ——
            </span>
          </li>
        ))}
      </ul>
      <SourceNote>
        Checks stay idle until the first device transmits. A reading that fails a check is rejected rather
        than quietly corrected.
      </SourceNote>
    </Panel>
  );
}
