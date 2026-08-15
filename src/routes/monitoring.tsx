import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/marea/AppShell";
import { SiteContextBar } from "@/components/marea/SiteContext";
import { SystemStatusBanner } from "@/components/marea/SystemStatusBanner";
import { TemperatureChart } from "@/components/marea/TemperatureChart";
import { RateOfChangeChart } from "@/components/marea/RateOfChangeChart";
import { EnvironmentalConditions } from "@/components/marea/EnvironmentalConditions";
import { IoTQualityPanel } from "@/components/marea/IoTQualityPanel";
import { PageHeader } from "@/components/marea/primitives";
import { AskMarea } from "@/components/marea/AskMarea";

const TITLE = "Monitoring — MAREA sea-water temperature";
const DESCRIPTION =
  "Continuous sea-water temperature monitoring, rate-of-change tracking and reading quality for aquaculture sites.";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Monitoring,
});

function Monitoring() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Monitoring"
        title="Water observation"
        description="Temperature against the level expected for the season, how fast conditions are moving, and whether the readings arriving can be trusted."
        actions={
          <AskMarea
            variant="inline"
            className="w-auto"
            questions={[
              "Explain this temperature trend",
              "Is the temperature changing unusually fast?",
              "Is the sensor reporting normally?",
            ]}
          />
        }
      />
      <SiteContextBar />
      <SystemStatusBanner />
      <TemperatureChart plain />
      <RateOfChangeChart plain />
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <IoTQualityPanel />
        <EnvironmentalConditions />
      </div>
    </AppShell>
  );
}
