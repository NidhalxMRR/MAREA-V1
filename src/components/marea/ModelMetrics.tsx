import { useState } from "react";
import { Info } from "lucide-react";
import { Panel, PanelHeader, StatusChip } from "./primitives";
import {
  DAILY_BASELINES,
  PERSISTENCE_EVALUATION,
  SCIENTIFIC_INTERPRETATION,
  DATASET,
} from "@/data/marea";
import { cn } from "@/lib/utils";

const fmt = (n: number) => (n === 0 ? "0.000" : n.toFixed(3));

export function ModelMetrics({ className }: { className?: string }) {
  const [horizon, setHorizon] = useState(1);
  const active = DAILY_BASELINES.find((h) => h.horizonDays === horizon) ?? DAILY_BASELINES[0]!;

  return (
    <Panel className={cn("overflow-hidden", className)}>
      <PanelHeader
        eyebrow="Baseline evaluation"
        title="Daily temperature baselines"
        description="Results read directly from the repository evaluation report. These are baselines, not a trained production forecast."
        actions={
          <div role="group" aria-label="Forecast horizon" className="flex rounded-lg border border-border bg-secondary p-0.5">
            {DAILY_BASELINES.map((h) => (
              <button
                key={h.horizonDays}
                type="button"
                aria-pressed={horizon === h.horizonDays}
                onClick={() => setHorizon(h.horizonDays)}
                className={cn(
                  "min-h-9 rounded-md px-3 text-xs font-medium transition-colors",
                  horizon === h.horizonDays
                    ? "bg-surface text-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {h.horizonDays}d
              </button>
            ))}
          </div>
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <caption className="sr-only">
            MAE and RMSE by baseline at a {horizon}-day horizon
          </caption>
          <thead>
            <tr className="border-b border-border text-left">
              <th scope="col" className="eyebrow px-5 py-2.5 font-semibold">Baseline</th>
              <th scope="col" className="eyebrow px-5 py-2.5 text-right font-semibold">MAE (°C)</th>
              <th scope="col" className="eyebrow px-5 py-2.5 text-right font-semibold">RMSE (°C)</th>
              <th scope="col" className="eyebrow px-5 py-2.5 text-right font-semibold">Samples</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <th scope="row" className="px-5 py-3 text-left font-medium text-foreground">
                Persistence
                <span className="block text-xs font-normal text-muted-foreground">
                  Last observed value carried forward
                </span>
              </th>
              <td className="tabular px-5 py-3 text-right">{fmt(active.persistence.mae)}</td>
              <td className="tabular px-5 py-3 text-right">{fmt(active.persistence.rmse)}</td>
              <td className="tabular px-5 py-3 text-right text-muted-foreground">
                {active.persistence.nSamples.toLocaleString("en-US")}
              </td>
            </tr>
            <tr>
              <th scope="row" className="px-5 py-3 text-left font-medium text-foreground">
                Seasonal persistence (365 d)
                <span className="block text-xs font-normal text-muted-foreground">
                  {active.seasonal.start} → {active.seasonal.end}
                </span>
              </th>
              <td className="tabular px-5 py-3 text-right">{fmt(active.seasonal.mae)}</td>
              <td className="tabular px-5 py-3 text-right">{fmt(active.seasonal.rmse)}</td>
              <td className="tabular px-5 py-3 text-right text-muted-foreground">
                {active.seasonal.nSamples.toLocaleString("en-US")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-3 border-t border-border bg-muted/40 px-5 py-4">
        <div className="flex items-start gap-2">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-caution-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Why the seasonal baseline reports zero error
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              The supplied series repeats exactly every {DATASET.repetition.lagRows} daily rows (
              {DATASET.repetition.matchingPairs.toLocaleString("en-US")} of{" "}
              {DATASET.repetition.comparedPairs.toLocaleString("en-US")} compared pairs match). A 365-day seasonal
              baseline therefore reproduces the target exactly. {SCIENTIFIC_INTERPRETATION}
            </p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Held-out persistence evaluation ({PERSISTENCE_EVALUATION.nSamples.toLocaleString("en-US")} samples): MAE{" "}
          {fmt(PERSISTENCE_EVALUATION.mae)} °C · RMSE {fmt(PERSISTENCE_EVALUATION.rmse)} °C · R²{" "}
          {PERSISTENCE_EVALUATION.r2.toFixed(4)}.
        </p>
        <StatusChip tone="caution">Not validated for operational forecasting</StatusChip>
      </div>
    </Panel>
  );
}
