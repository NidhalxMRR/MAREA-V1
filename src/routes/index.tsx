import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Gauge } from "lucide-react";
import { AppShell } from "@/components/marea/AppShell";
import { SiteContextBar } from "@/components/marea/SiteContext";
import { SystemStatusBanner } from "@/components/marea/SystemStatusBanner";
import { CurrentCondition } from "@/components/marea/CurrentCondition";
import { TemperatureChart } from "@/components/marea/TemperatureChart";
import { RateOfChangeChart } from "@/components/marea/RateOfChangeChart";
import { AlertPanel } from "@/components/marea/AlertPanel";
import { EnvironmentalConditions } from "@/components/marea/EnvironmentalConditions";
import { PageHeader, Panel, SourceNote, StatusChip } from "@/components/marea/primitives";
import { AskMarea } from "@/components/marea/AskMarea";
import { PIPELINE_STAGES, DATASET } from "@/data/marea";

const TITLE = "MAREA — Marine aquaculture early-warning overview";
const DESCRIPTION =
  "Sea-water temperature monitoring, seasonal reference and early-warning readiness for aquaculture operators and marine researchers.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Overview,
});

const stageTone = {
  available: "positive",
  partial: "caution",
  planned: "pending",
} as const;

const stageLabel = {
  available: "Available",
  partial: "In progress",
  planned: "Planned",
} as const;

function Overview() {
  return (
    <AppShell>
      {/* A. Situation header */}
      <PageHeader
        eyebrow="Site overview"
        title="Your water today"
        description="What the water is doing now, what is normal for this time of year, and whether anything needs attention."
        actions={<AskMarea variant="inline" className="w-auto" />}
      />

      <SiteContextBar />
      <SystemStatusBanner />

      {/* B. Primary environmental state */}
      <CurrentCondition />

      {/* C. Main visualisation */}
      <TemperatureChart plain />

      {/* D. Attention and change */}
      <section aria-label="Attention" className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <RateOfChangeChart plain className="xl:col-span-2" />
        <AlertPanel compact />
      </section>

      <EnvironmentalConditions />

      {/* Readiness — deliberately last and quiet */}
      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow mb-1">Readiness</p>
            <h2 className="text-base font-semibold text-foreground">What MAREA can do so far</h2>
          </div>
          <Link
            to="/research"
            className="inline-flex min-h-9 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Where the data comes from
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ol className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
          {PIPELINE_STAGES.map((stage, i) => (
            <li key={stage.label} className="bg-surface px-5 py-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <p className="min-w-0 text-sm font-medium text-foreground">
                  <span className="tabular mr-2 text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {stage.label}
                </p>
                <StatusChip tone={stageTone[stage.state]}>{stageLabel[stage.state]}</StatusChip>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.note}</p>
            </li>
          ))}
        </ol>
        <SourceNote icon={<Gauge />}>
          Current source: researcher daily series {DATASET.dateRange[0]} → {DATASET.dateRange[1]}. Approved
          for research; not approved for operational forecasting.
        </SourceNote>
      </Panel>
    </AppShell>
  );
}
