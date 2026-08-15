import { BellOff, ShieldCheck } from "lucide-react";
import { Panel, PanelHeader, QuietEmpty, SourceNote, StatusChip } from "./primitives";
import { cn } from "@/lib/utils";

const WATCHLIST = [
  { label: "Unexpected temperature increase", requires: "Live readings + seasonal comparison" },
  { label: "Water changing too fast", requires: "Sub-daily measurement interval" },
  { label: "Sensor offline or delayed", requires: "Device heartbeat" },
  { label: "Missing or duplicate readings", requires: "Ingestion validation" },
  { label: "Forecast environmental risk", requires: "Validated production forecast" },
];

export function AlertPanel({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Panel className={cn("overflow-hidden", className)}>
      <PanelHeader
        eyebrow="Attention"
        title={compact ? "Needs attention" : "Early-warning status"}
        description={
          compact
            ? "Nothing is flagged, because no measurements are being received yet."
            : "Conditions MAREA will evaluate continuously once measurements are flowing."
        }
        actions={
          <StatusChip tone="pending" icon={<BellOff />}>
            0 active
          </StatusChip>
        }
      />
      <div className="space-y-4 p-4 sm:p-5">
        <QuietEmpty>
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <ShieldCheck aria-hidden className="size-4" />
            No warnings
          </span>
          <span className="mt-1 block">
            MAREA raises a warning only from a validated measurement — never from the historical reference
            alone.
          </span>
        </QuietEmpty>
        <div>
          <p className="eyebrow mb-2">What MAREA will watch for</p>
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
            {WATCHLIST.map((item) => (
              <li
                key={item.label}
                className="flex flex-col gap-0.5 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <span className="text-sm text-foreground">{item.label}</span>
                <span className="text-xs text-muted-foreground sm:text-right">Needs: {item.requires}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {compact ? null : (
        <SourceNote>
          Warnings will be raised, acknowledged and resolved against accepted readings only, and every one
          will record the measurement it came from.
        </SourceNote>
      )}
    </Panel>
  );
}
