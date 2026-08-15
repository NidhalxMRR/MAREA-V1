import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StatusChip, type StatusTone } from "./primitives";

export interface EnvironmentalMetricCardProps {
  label: string;
  icon?: ReactNode;
  /** Rendered value. Omit when no real data exists. */
  value?: string;
  unit?: string;
  /** Shown in place of a value when the source is not live. */
  placeholder?: string;
  status?: { tone: StatusTone; label: string; icon?: ReactNode };
  hint?: string;
  className?: string;
}

export function EnvironmentalMetricCard({
  label,
  icon,
  value,
  unit,
  placeholder,
  status,
  hint,
  className,
}: EnvironmentalMetricCardProps) {
  const hasValue = Boolean(value);

  return (
    <article
      className={cn(
        "panel flex min-h-[9.5rem] flex-col justify-between gap-4 p-4 transition-colors hover:border-border-strong sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon ? (
            <span aria-hidden className="text-muted-foreground [&_svg]:size-4">
              {icon}
            </span>
          ) : null}
          <h3 className="text-sm font-medium text-foreground">{label}</h3>
        </div>
        {status ? (
          <StatusChip tone={status.tone} icon={status.icon}>
            {status.label}
          </StatusChip>
        ) : null}
      </div>

      <div>
        {hasValue ? (
          <p className="tabular text-3xl leading-none font-medium text-foreground">
            {value}
            {unit ? (
              <span className="ml-1 text-base font-normal text-muted-foreground">{unit}</span>
            ) : null}
          </p>
        ) : (
          <p className="flex items-baseline gap-2 text-muted-foreground">
            <span aria-hidden className="tabular text-3xl leading-none text-border-strong">
              ——
            </span>
            <span className="text-sm">{placeholder ?? "Awaiting live sensor data"}</span>
          </p>
        )}
        {hint ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
      </div>
    </article>
  );
}
