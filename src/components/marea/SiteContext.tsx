import type { ReactNode } from "react";
import { MapPin, Radio, Clock, Waves } from "lucide-react";
import { StatusChip, type StatusTone } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * Reusable site/farm context bar.
 *
 * MAREA may later manage several aquaculture sites, so this component takes a
 * site descriptor rather than hardcoding one. No site is configured yet, so
 * every field falls back to a truthful placeholder — nothing is invented.
 */
export interface SiteDescriptor {
  name?: string | undefined;
  location?: string | undefined;
  device?: string | undefined;
  lastMeasurement?: string | undefined;
  status?: { tone: StatusTone; label: string } | undefined;
}

export const PENDING_SITE: SiteDescriptor = {
  status: { tone: "pending", label: "Site configuration pending" },
};

function Field({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | undefined;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span aria-hidden className="mt-0.5 shrink-0 text-muted-foreground [&_svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p
          className={cn(
            "mt-0.5 text-sm leading-snug",
            value ? "font-medium text-foreground" : "text-muted-foreground",
          )}
        >
          {value ?? "Not configured"}
        </p>
      </div>
    </div>
  );
}

export function SiteContextBar({
  site = PENDING_SITE,
  actions,
  className,
}: {
  site?: SiteDescriptor;
  actions?: ReactNode;
  className?: string;
}) {
  const status = site.status ?? PENDING_SITE.status!;

  return (
    <section
      aria-label="Site context"
      className={cn("panel overflow-hidden", className)}
    >
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3.5 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-muted text-muted-foreground"
          >
            <Waves className="size-4.5" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow">Production site</p>
            <h2 className="text-base font-semibold leading-snug text-foreground sm:truncate">
              {site.name ?? "No production site connected"}
            </h2>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <StatusChip tone={status.tone}>{status.label}</StatusChip>
          {actions}
        </div>
      </div>
      <dl className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
        <div className="bg-surface px-4 py-3 sm:px-5">
          <Field icon={<MapPin />} label="Location" value={site.location} />
        </div>
        <div className="bg-surface px-4 py-3 sm:px-5">
          <Field icon={<Radio />} label="Connected device" value={site.device} />
        </div>
        <div className="bg-surface px-4 py-3 sm:px-5">
          <Field icon={<Clock />} label="Latest accepted reading" value={site.lastMeasurement} />
        </div>
      </dl>
    </section>
  );
}
