import { createFileRoute } from "@tanstack/react-router";
import { Database, FlaskConical } from "lucide-react";
import { AppShell } from "@/components/marea/AppShell";
import { ModelMetrics } from "@/components/marea/ModelMetrics";
import { RateOfChangeChart } from "@/components/marea/RateOfChangeChart";
import {
  PageHeader,
  Panel,
  PanelHeader,
  QuietEmpty,
  SourceNote,
  StatusChip,
} from "@/components/marea/primitives";
import { DATASET, DESCRIPTIVE_RANGE, SCIENTIFIC_INTERPRETATION } from "@/data/marea";

const TITLE = "Analytics — MAREA temperature baselines and seasonality";
const DESCRIPTION =
  "Researcher analytics: descriptive distribution, seasonal structure, rate of change and persistence baseline evaluation with MAE and RMSE.";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Analytics,
});

const SUMMARY = [
  { label: "Rows", value: DATASET.rows.toLocaleString("en-US"), unit: "daily" },
  { label: "Coverage", value: "2004 → 2013", unit: "~10 y" },
  {
    label: "Range",
    value: `${DESCRIPTIVE_RANGE.min.toFixed(2)}–${DESCRIPTIVE_RANGE.max.toFixed(2)}`,
    unit: "°C",
  },
  { label: "Mean", value: DESCRIPTIVE_RANGE.mean.toFixed(2), unit: "°C" },
];

/** Positions on the min→max axis, computed from real descriptive statistics. */
function pct(v: number) {
  const { min, max } = DESCRIPTIVE_RANGE;
  return ((v - min) / (max - min)) * 100;
}

const MARKERS = [
  { label: "Mean", value: DESCRIPTIVE_RANGE.mean },
  { label: "P90", value: DESCRIPTIVE_RANGE.q90Cutoff },
  { label: "P95", value: DESCRIPTIVE_RANGE.q95Cutoff },
];

function Analytics() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Research"
        title="Analysis workbench"
        description="Descriptive structure, change behaviour and baseline evaluation for the researcher-supplied daily temperature series."
        actions={
          <StatusChip tone="caution" icon={<FlaskConical />}>
            Research use only
          </StatusChip>
        }
      />

      <section aria-label="Dataset summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="panel px-4 py-4">
            <p className="eyebrow">{s.label}</p>
            <p className="tabular mt-2 text-xl leading-none font-medium text-foreground">
              {s.value}
              <span className="ml-1 text-xs font-normal text-muted-foreground">{s.unit}</span>
            </p>
          </div>
        ))}
      </section>

      <Panel className="overflow-hidden">
        <PanelHeader
          eyebrow="Distribution"
          title="Descriptive temperature distribution"
          description="Published statistics of the supplied series. These are descriptive cut-offs, not biological or risk thresholds."
          actions={<StatusChip tone="positive">From repository reports</StatusChip>}
        />
        <div className="px-5 py-6">
          <div className="relative h-2.5 w-full rounded-full bg-gradient-to-r from-[var(--color-reference)]/25 via-[var(--color-reference)]/45 to-[var(--color-caution)]/55">
            {MARKERS.map((m) => (
              <span
                key={m.label}
                className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-border-strong"
                style={{ left: `${pct(m.value)}%` }}
              />
            ))}
          </div>
          <div className="tabular mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{DESCRIPTIVE_RANGE.min.toFixed(2)} °C</span>
            <span>{DESCRIPTIVE_RANGE.max.toFixed(2)} °C</span>
          </div>
          <dl className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {MARKERS.map((m) => (
              <div key={m.label} className="bg-surface px-4 py-3">
                <dt className="eyebrow">{m.label}</dt>
                <dd className="tabular mt-1.5 text-lg leading-none font-medium text-foreground">
                  {m.value.toFixed(2)}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">°C</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <SourceNote>{DESCRIPTIVE_RANGE.note}</SourceNote>
      </Panel>

      <Panel className="overflow-hidden">
        <PanelHeader
          eyebrow="Series"
          title="Historical daily series"
          description={`${DATASET.rows.toLocaleString("en-US")} daily rows, ${DATASET.dateRange[0]} → ${DATASET.dateRange[1]}, held in the analytics repository.`}
          actions={<StatusChip tone="pending">Not bundled</StatusChip>}
        />
        <div className="p-5">
          <QuietEmpty>
            The raw workbook is deliberately kept outside the application bundle. Once an immutable processed
            extract is published, this panel renders the full daily series with year-over-year overlay.
          </QuietEmpty>
        </div>
        <SourceNote icon={<Database />}>
          Source: {DATASET.workbook} · worksheet {DATASET.worksheet} · columns {DATASET.timestampColumn},{" "}
          {DATASET.temperatureColumn}.
        </SourceNote>
      </Panel>

      <RateOfChangeChart />
      <ModelMetrics />

      <Panel className="overflow-hidden">
        <PanelHeader
          eyebrow="Interpretation"
          title="Seasonal structure vs. forecast skill"
          description="Two different claims that must not be confused."
        />
        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
          <div className="bg-surface px-5 py-5">
            <StatusChip tone="positive">Supported by the data</StatusChip>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              The supplied series has a strong, fully deterministic annual structure. It is a legitimate
              seasonal temperature reference for the site and a useful expectation baseline to compare future
              live measurements against.
            </p>
          </div>
          <div className="bg-surface px-5 py-5">
            <StatusChip tone="caution">Not supported</StatusChip>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              Zero seasonal-baseline error is an artefact of the exact {DATASET.repetition.lagRows}-row
              repetition, not evidence of real-world forecast skill. Independent-year and live-site validation
              are required before any operational forecasting claim.
            </p>
          </div>
        </div>
        <SourceNote>{SCIENTIFIC_INTERPRETATION}</SourceNote>
      </Panel>
    </AppShell>
  );
}
