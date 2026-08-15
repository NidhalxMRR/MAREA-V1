import { CircleDashed, Cpu, MapPin, Radio, Timer } from "lucide-react";
import { Panel, PanelHeader, SourceNote, StatusChip } from "./primitives";
import { IOT_CONTRACT } from "@/data/marea";
import { cn } from "@/lib/utils";

/**
 * Device management surface. No device is connected, so no "Online" state is
 * ever shown and no device row is fabricated — the table renders its real
 * zero-device state with the column structure the fleet will use.
 */
const COLUMNS = ["Device", "Connection", "Last contact", "Position", "Temperature sensor", "Data quality"];

export function SensorStatus({ className }: { className?: string }) {
  return (
    <Panel className={cn("overflow-hidden", className)}>
      <PanelHeader
        eyebrow="Fleet"
        title="Devices"
        description="Connectivity, position and health for every MAREA water-temperature device."
        actions={
          <StatusChip tone="pending" icon={<CircleDashed />}>
            0 devices
          </StatusChip>
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <caption className="sr-only">Registered MAREA devices</caption>
          <thead>
            <tr className="border-b border-border text-left">
              {COLUMNS.map((c) => (
                <th key={c} scope="col" className="eyebrow px-5 py-2.5 font-semibold whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={COLUMNS.length} className="px-5 py-10">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Radio aria-hidden className="size-5 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">No device has been registered yet</p>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    The IoT hardware is being developed separately. Connection, delay, offline and
                    calibration states will populate this table once the first device transmits.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-t border-border p-5">
        <p className="eyebrow mb-2">Expected reading payload</p>
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {IOT_CONTRACT.map((field) => (
            <li
              key={field.field}
              className="flex flex-col gap-0.5 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span className="tabular text-xs text-foreground">{field.field}</span>
              <span className="text-xs text-muted-foreground sm:text-right">{field.description}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Timer aria-hidden className="size-3.5" /> Target interval ~15 minutes
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3.5" /> Per-device GPS position
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Cpu aria-hidden className="size-3.5" /> Firmware and health reported by the device
          </span>
        </p>
      </div>

      <SourceNote>
        Device rows appear only for hardware that has actually reported to MAREA. Nothing on this page is
        simulated.
      </SourceNote>
    </Panel>
  );
}
