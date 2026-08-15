import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, PlugZap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One consolidated statement of system state.
 *
 * Individual panels can then use light, quiet empty states instead of each
 * repeating "not connected".
 */
export function SystemStatusBanner({
  title = "Live monitoring unavailable",
  detail = "No IoT device is connected to MAREA yet, so no water measurements are being received. Everything below shows what will appear once the site sensor starts reporting.",
  action,
  className,
}: {
  title?: string;
  detail?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4 sm:px-5",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface text-muted-foreground"
      >
        <PlugZap className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{detail}</p>
      </div>
      {action ?? (
        <Link
          to="/sensors"
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 self-start rounded-lg border border-border bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:border-border-strong sm:self-auto"
        >
          Sensor connection
          <ArrowUpRight aria-hidden className="size-4" />
        </Link>
      )}
    </div>
  );
}
