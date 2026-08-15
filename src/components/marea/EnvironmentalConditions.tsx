import { CloudSun, Waves, Wind, Thermometer } from "lucide-react";
import { Panel, PanelHeader, SourceNote, StatusChip } from "./primitives";
import { cn } from "@/lib/utils";

const CONDITIONS = [
  { label: "Air temperature", icon: Thermometer, unit: "°C" },
  { label: "Wind", icon: Wind, unit: "m/s" },
  { label: "Sea state", icon: Waves, unit: "m" },
  { label: "Sky", icon: CloudSun, unit: "" },
];

export function EnvironmentalConditions({ className }: { className?: string }) {
  return (
    <Panel className={cn("overflow-hidden", className)}>
      <PanelHeader
        eyebrow="Context"
        title="Weather and sea conditions"
        description="Surrounding conditions that help explain what the water temperature is doing."
        actions={<StatusChip tone="pending">Coming later</StatusChip>}
      />
      <ul className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
        {CONDITIONS.map(({ label, icon: Icon, unit }) => (
          <li key={label} className="bg-surface px-4 py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon aria-hidden className="size-4 shrink-0" />
              <span className="text-sm font-medium leading-snug text-foreground">{label}</span>
            </div>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span aria-hidden className="tabular text-2xl leading-none text-border-strong">
                ——
              </span>
              {unit ? <span className="text-xs text-muted-foreground">{unit}</span> : null}
            </p>
          </li>
        ))}
      </ul>
      <SourceNote>
        No weather values are stored in MAREA. This area is wired for a real provider integration in a later
        phase.
      </SourceNote>
    </Panel>
  );
}
