import { createFileRoute } from "@tanstack/react-router";
import { BellOff } from "lucide-react";
import { AppShell } from "@/components/marea/AppShell";
import { AlertPanel } from "@/components/marea/AlertPanel";
import { SystemStatusBanner } from "@/components/marea/SystemStatusBanner";
import {
  PageHeader,
  Panel,
  PanelHeader,
  QuietEmpty,
  SourceNote,
  StatusChip,
} from "@/components/marea/primitives";

const TITLE = "Alerts — MAREA early-warning status";
const DESCRIPTION =
  "Early-warning conditions MAREA evaluates for aquaculture sites, and the measurements each warning requires.";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Alerts,
});

function Alerts() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Early warning"
        title="Needs attention"
        description="MAREA warns you only when a checked measurement supports it. Nothing is guessed from the historical reference alone."
        actions={
          <StatusChip tone="pending" icon={<BellOff />}>
            0 active
          </StatusChip>
        }
      />
      <SystemStatusBanner
        title="Warnings are not active yet"
        detail="Water measurements have to be arriving before MAREA can tell you something is wrong."
      />
      <AlertPanel />
      <Panel className="overflow-hidden">
        <PanelHeader
          eyebrow="Record"
          title="Warning history"
          description="Every raised, acknowledged and resolved warning is kept here so you can show what happened and when."
        />
        <div className="p-5">
          <QuietEmpty>
            No warnings have been raised. History begins with the first checked measurement.
          </QuietEmpty>
        </div>
        <SourceNote>
          Each history entry will record the reading that triggered it, who acknowledged it, and when it was
          resolved.
        </SourceNote>
      </Panel>
    </AppShell>
  );
}
