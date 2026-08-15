import { ActivitySquare } from "lucide-react";
import { EmptyState, Panel, PanelHeader, SourceNote } from "./primitives";
import { AskMarea } from "./AskMarea";
import { cn } from "@/lib/utils";

/**
 * Rate of change is the signal MAREA cares most about: abrupt shifts.
 * No alarm threshold is drawn — MAREA has not defined one, and no values are
 * generated to fill the canvas.
 */
export function RateOfChangeChart({
  className,
  plain,
}: {
  className?: string;
  plain?: boolean;
}) {
  return (
    <Panel className={cn("overflow-hidden", className)}>
      <PanelHeader
        eyebrow={plain ? "Recent change" : "Change detection"}
        title={plain ? "How fast the water is changing" : "Temperature rate of change"}
        description={
          plain
            ? "Sudden swings matter more than the absolute value. This shows how much the water moved between readings."
            : "Day-over-day difference in °C. Once 15-minute IoT readings arrive this switches to °C/hour for short-horizon abrupt-change detection."
        }
        actions={
          <AskMarea
            variant="ghost"
            label="Ask about change"
            questions={[
              "Is the temperature changing unusually fast?",
              "What counts as an abrupt change?",
              "Explain the recent change at this site",
            ]}
          />
        }
      />
      <div className="p-4 sm:p-5">
        <EmptyState
          icon={<ActivitySquare />}
          title="Change is calculated from real readings"
          description={
            plain
              ? "As soon as two accepted readings exist, MAREA shows the change between them here."
              : "Abrupt-change detection begins when the IoT stream delivers timestamped readings. Historical daily differences remain available in the analytics repository."
          }
          className="h-[13rem] sm:h-56"
        />
      </div>
      <SourceNote>
        No alarm threshold is drawn. MAREA has not defined a biological or risk threshold, and none is
        inferred from the historical reference.
      </SourceNote>
    </Panel>
  );
}
