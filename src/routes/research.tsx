import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { AppShell } from "@/components/marea/AppShell";
import { DataProvenance } from "@/components/marea/DataProvenance";
import { IoTQualityPanel } from "@/components/marea/IoTQualityPanel";
import { PageHeader, Panel, PanelHeader, SourceNote, StatusChip } from "@/components/marea/primitives";
import { DATASET, SCIENTIFIC_INTERPRETATION } from "@/data/marea";

const TITLE = "Data & provenance — MAREA dataset transparency";
const DESCRIPTION =
  "Source, coverage, validation status and known limitations of the researcher-provided sea-temperature dataset used by MAREA.";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Research,
});

function Research() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Transparency"
        title="Data & provenance"
        description="MAREA records where every value comes from, what has been verified, and what remains unresolved."
        actions={<StatusChip tone="neutral">{DATASET.id}</StatusChip>}
      />
      <DataProvenance />
      <Panel className="overflow-hidden">
        <PanelHeader
          eyebrow="Statement"
          title="Scientific interpretation"
          actions={
            <StatusChip tone="neutral" icon={<FileText />}>
              From repository report
            </StatusChip>
          }
        />
        <p className="px-5 py-5 text-sm leading-relaxed text-foreground">{SCIENTIFIC_INTERPRETATION}</p>
        <SourceNote>
          If additional historical years are provided, they are ingested as separate immutable raw sources and
          re-validated before use.
        </SourceNote>
      </Panel>
      <IoTQualityPanel />
    </AppShell>
  );
}
