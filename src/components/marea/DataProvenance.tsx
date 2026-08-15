import type { ReactNode } from "react";
import { CheckCircle2, CircleHelp, FileSpreadsheet, ShieldAlert } from "lucide-react";
import { Panel, PanelHeader, StatusChip } from "./primitives";
import { DATASET, DESCRIPTIVE_RANGE } from "@/data/marea";
import { cn } from "@/lib/utils";

function Section({
  title,
  status,
  children,
}: {
  title: string;
  status?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="bg-surface px-5 py-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <h3 className="eyebrow min-w-0">{title}</h3>
        {status}
      </div>
      <dl className="mt-3 space-y-2.5">{children}</dl>
    </section>
  );
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-44 shrink-0 text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-sm leading-relaxed text-foreground">{children}</dd>
    </div>
  );
}

export function DataProvenance({ className }: { className?: string }) {
  return (
    <Panel className={cn("overflow-hidden", className)}>
      <PanelHeader
        eyebrow="Provenance"
        title="Evidence record"
        description="Where every value comes from, what has been checked, and exactly what the dataset can and cannot support."
        actions={
          <StatusChip tone="neutral" icon={<FileSpreadsheet />}>
            {DATASET.id}
          </StatusChip>
        }
      />

      <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-2">
        <Section title="Source">
          <Item label="Workbook">
            <span className="tabular text-xs">{DATASET.workbook}</span>
          </Item>
          <Item label="Worksheet">
            <span className="tabular text-xs">{DATASET.worksheet}</span>
          </Item>
          <Item label="Columns used">
            <span className="tabular text-xs">{DATASET.timestampColumn}</span> ·{" "}
            <span className="tabular text-xs">{DATASET.temperatureColumn}</span>
          </Item>
        </Section>

        <Section title="Coverage">
          <Item label="Supplied period">
            {DATASET.dateRange[0]} → {DATASET.dateRange[1]}
          </Item>
          <Item label="Rows">{DATASET.rows.toLocaleString("en-US")}</Item>
          <Item label="Reported history">{DATASET.statedHistory}</Item>
        </Section>

        <Section title="Sampling">
          <Item label="Frequency">{DATASET.samplingFrequency}</Item>
          <Item label="Descriptive range">
            {DESCRIPTIVE_RANGE.min.toFixed(2)} – {DESCRIPTIVE_RANGE.max.toFixed(2)} °C
          </Item>
          <Item label="Mean">{DESCRIPTIVE_RANGE.mean.toFixed(2)} °C</Item>
          <Item label="Thresholds">None configured — these are descriptive statistics, not risk limits.</Item>
        </Section>

        <Section
          title="Validation"
          status={<StatusChip tone="positive">Complete</StatusChip>}
        >
          <Item label="Provenance">
            <span className="inline-flex items-start gap-1.5">
              <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-positive" />
              Source, worksheet and columns recorded
            </span>
          </Item>
          <Item label="Repetition audit">
            <span className="inline-flex items-start gap-1.5">
              <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-positive" />
              {DATASET.repetition.matchingPairs.toLocaleString("en-US")}/
              {DATASET.repetition.comparedPairs.toLocaleString("en-US")} pairs compared at lag{" "}
              {DATASET.repetition.lagRows}
            </span>
          </Item>
        </Section>

        <Section title="Known characteristics">
          <Item label="Annual repetition">
            The series repeats exactly every {DATASET.repetition.lagRows} consecutive daily rows, giving it a
            deterministic annual structure.
          </Item>
          <Item label="Open question">
            <span className="inline-flex items-start gap-1.5">
              <CircleHelp aria-hidden className="mt-0.5 size-4 shrink-0 text-caution-foreground" />
              {DATASET.openQuestion}
            </span>
          </Item>
        </Section>

        <Section
          title="Research authorization"
          status={<StatusChip tone="positive">Approved</StatusChip>}
        >
          <Item label="Authorized use">{DATASET.research.authorization}</Item>
          <Item label="Suitable for">
            Seasonal reference, baseline evaluation and model-development research.
          </Item>
        </Section>
      </div>

      <div className="border-t border-border bg-muted/40 px-5 py-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <h3 className="eyebrow min-w-0">Operational status</h3>
          <StatusChip tone="caution">Live validation required</StatusChip>
        </div>
        <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-foreground">
          <ShieldAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-caution-foreground" />
          <span>
            The dataset is a valid research and seasonal-reference source. It is not yet cleared for
            operational forecasting: {DATASET.operational.reason}
          </span>
        </p>
      </div>
    </Panel>
  );
}
