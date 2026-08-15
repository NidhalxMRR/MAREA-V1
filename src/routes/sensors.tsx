import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/marea/AppShell";
import { SiteContextBar } from "@/components/marea/SiteContext";
import { SystemStatusBanner } from "@/components/marea/SystemStatusBanner";
import { SensorStatus } from "@/components/marea/SensorStatus";
import { IoTQualityPanel } from "@/components/marea/IoTQualityPanel";
import { PageHeader, Panel, PanelHeader, SourceNote, StatusChip } from "@/components/marea/primitives";

const TITLE = "Sensors — MAREA IoT fleet status";
const DESCRIPTION =
  "IoT device connectivity, expected reading payload and data-quality validation for MAREA sea-temperature sensors.";

export const Route = createFileRoute("/sensors")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Sensors,
});

const ROADMAP = [
  { label: "Register device", note: "Device ID, site and GPS position" },
  { label: "Field connection", note: "Transmission link under development" },
  { label: "Checks on arrival", note: "Reject malformed, duplicate or impossible readings" },
  { label: "Live monitoring", note: "Feeds temperature and change tracking" },
];

function Sensors() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Equipment"
        title="Sensor connection"
        description="MAREA is built around site devices reporting water temperature with position and health roughly every 15 minutes."
        actions={<StatusChip tone="pending">0 connected</StatusChip>}
      />
      <SiteContextBar />
      <SystemStatusBanner
        title="No device connected"
        detail="Once hardware is installed and registered, it appears here with its connection state, last contact and reading quality."
        action={<span className="sr-only" />}
      />
      <SensorStatus />
      <IoTQualityPanel />
      <Panel className="overflow-hidden">
        <PanelHeader eyebrow="Programme" title="Getting to live measurements" />
        <ol className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
          {ROADMAP.map((step, i) => (
            <li key={step.label} className="bg-surface px-5 py-4">
              <p className="tabular text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{step.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.note}</p>
            </li>
          ))}
        </ol>
        <SourceNote>
          Firmware version, battery and calibration history will be added to each device record as the
          hardware programme delivers them.
        </SourceNote>
      </Panel>
    </AppShell>
  );
}
