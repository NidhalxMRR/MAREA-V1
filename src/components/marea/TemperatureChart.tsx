import { useState } from "react";
import { Thermometer, WifiOff } from "lucide-react";
import { EmptyState, Panel, PanelHeader, SourceNote, StatusChip } from "./primitives";
import { AskMarea } from "./AskMarea";
import { DATASET } from "@/data/marea";
import { cn } from "@/lib/utils";

export type RangeKey = "30D" | "90D" | "SEASON";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "30D", label: "30D" },
  { key: "90D", label: "90D" },
  { key: "SEASON", label: "Season" },
];

type SeriesKey = "actual" | "reference" | "forecast";

const SERIES: {
  key: SeriesKey;
  label: string;
  color: string;
  dash?: boolean;
  state: string;
}[] = [
  { key: "actual", label: "Measured water temperature", color: "var(--color-actual)", state: "Unavailable — no sensor connected" },
  { key: "reference", label: "Historical seasonal reference", color: "var(--color-reference)", state: "Available in the research repository" },
  { key: "forecast", label: "Forecast", color: "var(--color-forecast)", dash: true, state: "Not released" },
];

/**
 * The central analytical object of MAREA.
 *
 * No values are ever fabricated: there is no live IoT stream, the researcher
 * daily series is held outside the application bundle and no production
 * forecast exists. The chart therefore renders an honest empty canvas and the
 * legend communicates the planned series and their real availability.
 */
export function TemperatureChart({
  className,
  plain,
}: {
  className?: string;
  /** Operational pages get the short explanation; research pages the full one. */
  plain?: boolean;
}) {
  const [range, setRange] = useState<RangeKey>("90D");

  return (
    <Panel className={cn("overflow-hidden", className)}>
      <PanelHeader
        eyebrow="Water temperature"
        title={plain ? "Temperature over time" : "Sea-water temperature series"}
        description={
          plain
            ? "One view for the measured temperature at your site and the level normally expected at this time of year."
            : "A single canvas for measured IoT temperature, the researcher-derived seasonal reference and, once released, model forecasts."
        }
        actions={
          <div
            role="group"
            aria-label="Time range"
            className="flex rounded-lg border border-border bg-secondary p-0.5"
          >
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                aria-pressed={range === r.key}
                onClick={() => setRange(r.key)}
                className={cn(
                  "min-h-9 rounded-md px-3 text-xs font-medium transition-colors",
                  range === r.key
                    ? "bg-surface text-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <ul className="flex flex-col gap-2 border-b border-border px-5 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
        {SERIES.map((s) => (
          <li key={s.key} className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden
              className="h-0.5 w-5 shrink-0 rounded-full"
              style={{
                backgroundColor: s.dash ? "transparent" : s.color,
                backgroundImage: s.dash
                  ? `repeating-linear-gradient(90deg, ${s.color} 0 4px, transparent 4px 8px)`
                  : undefined,
                opacity: s.key === "reference" ? 1 : 0.45,
              }}
            />
            <span className="text-xs font-medium text-foreground">{s.label}</span>
            <span className="text-xs text-muted-foreground">· {s.state}</span>
          </li>
        ))}
      </ul>

      <div className="p-4 sm:p-5">
        <EmptyState
          icon={<WifiOff />}
          title="No temperature series to plot yet"
          description={
            plain
              ? "Your site has no connected sensor, so there is nothing to draw. This chart fills in automatically with the first accepted reading."
              : "No live IoT stream and no published production forecast. The researcher daily series is held in the analytics repository and is not yet bundled with the interface."
          }
          footer={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <StatusChip tone="pending" icon={<Thermometer />}>
                Waiting for the first reading
              </StatusChip>
              <AskMarea
                variant="ghost"
                label="Ask about this chart"
                questions={[
                  "Explain this temperature trend",
                  "What does the seasonal reference mean?",
                  "Is the temperature changing unusually fast?",
                ]}
              />
            </div>
          }
          className="h-[16rem] sm:h-[22rem] lg:h-[24rem]"
        />
      </div>

      <SourceNote>
        {plain ? (
          <>
            Expected seasonal levels come from a researcher-supplied historical series ({DATASET.dateRange[0]}{" "}
            → {DATASET.dateRange[1]}). It describes a normal year — it is not a forecast.
          </>
        ) : (
          <>
            Reference source: <span className="tabular">{DATASET.id}</span> · {DATASET.samplingFrequency}{" "}
            sampling · {DATASET.dateRange[0]} → {DATASET.dateRange[1]}. Approved for research; not approved
            for operational forecasting.
          </>
        )}
      </SourceNote>
    </Panel>
  );
}
