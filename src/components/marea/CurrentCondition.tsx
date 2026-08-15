import type { ReactNode } from "react";
import { Clock, MoveHorizontal, Radio, Thermometer, Waves } from "lucide-react";
import { Panel, SourceNote, StatusChip } from "./primitives";
import { AskMarea } from "./AskMarea";
import { cn } from "@/lib/utils";

/**
 * Primary environmental state for an operator.
 *
 * Water temperature carries the strongest visual weight; trend, expected
 * seasonal level, last reading and sensor connection sit beside it as quieter
 * supporting facts. Nothing is invented — absence is shown calmly.
 */

function SecondaryFact({
  icon,
  label,
  placeholder,
  note,
}: {
  icon: ReactNode;
  label: string;
  placeholder: string;
  note?: string;
}) {
  return (
    <div className="min-w-0 bg-surface px-4 py-3.5 sm:px-5">
      <div className="flex items-center gap-2">
        <span aria-hidden className="shrink-0 text-muted-foreground [&_svg]:size-4">
          {icon}
        </span>
        <p className="text-sm font-medium leading-snug text-foreground">{label}</p>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{placeholder}</p>
      {note ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground/85">{note}</p> : null}
    </div>
  );
}

export function CurrentCondition({ className }: { className?: string }) {
  return (
    <Panel className={cn("overflow-hidden", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Primary — water temperature */}
        <div className="flex flex-col justify-between gap-6 border-b border-border p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <p className="eyebrow">Current water condition</p>
              <h2 className="mt-1 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Thermometer aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
                Water temperature
              </h2>
            </div>
            <StatusChip tone="pending">Waiting for sensor</StatusChip>
          </div>

          <div>
            <p className="flex items-baseline gap-3">
              <span aria-hidden className="tabular text-5xl leading-none font-medium text-border-strong sm:text-6xl">
                ——
              </span>
              <span className="text-lg text-muted-foreground">°C</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              No measurement has reached MAREA yet. This is expected while the site sensor is being
              installed — it is not a fault.
            </p>
          </div>

          <AskMarea
            variant="ghost"
            className="-ml-2.5 self-start"
            label="Ask about conditions here"
            questions={[
              "Summarize conditions at this site",
              "What will I see once the sensor is connected?",
              "What does the seasonal reference mean?",
            ]}
          />
        </div>

        {/* Secondary facts */}
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
          <SecondaryFact
            icon={<MoveHorizontal />}
            label="Temperature trend"
            placeholder="Needs two readings"
            note="Rising, steady or falling."
          />
          <SecondaryFact
            icon={<Waves />}
            label="Expected seasonal level"
            placeholder="Reference not loaded"
            note="Typical level for this time of year."
          />
          <SecondaryFact
            icon={<Clock />}
            label="Last reading"
            placeholder="None received"
            note="Time of the most recent accepted measurement."
          />
          <SecondaryFact
            icon={<Radio />}
            label="Sensor connection"
            placeholder="No device registered"
            note="Connection and health of the site device."
          />
        </div>
      </div>
      <SourceNote>
        Measured values come only from a connected site sensor. Expected seasonal levels come from a
        researcher-supplied historical series and describe a normal year, not a forecast.
      </SourceNote>
    </Panel>
  );
}
