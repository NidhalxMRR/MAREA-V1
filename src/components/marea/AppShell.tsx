import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BellRing,
  FlaskConical,
  LayoutDashboard,
  LineChart,
  Menu,
  Radio,
  Waves,
  X,
} from "lucide-react";
import { BRAND } from "@/data/marea";
import { AskMarea } from "./AskMarea";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, group: "Operations" },
  { to: "/monitoring", label: "Monitoring", icon: Activity, group: "Operations" },
  { to: "/alerts", label: "Alerts", icon: BellRing, group: "Operations" },
  { to: "/sensors", label: "Sensors", icon: Radio, group: "Operations" },
  { to: "/analytics", label: "Analytics", icon: LineChart, group: "Research" },
  { to: "/research", label: "Data & provenance", icon: FlaskConical, group: "Research" },
] as const;

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const groups = ["Operations", "Research"] as const;

  return (
    <nav aria-label="Main" className="space-y-6">
      {groups.map((group) => (
        <div key={group}>
          <p className="eyebrow px-3 pb-2 text-ink-muted">{group}</p>
          <ul className="space-y-0.5">
            {NAV.filter((item) => item.group === group).map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-ink-foreground/10 text-ink-foreground"
                        : "text-ink-muted hover:bg-ink-foreground/5 hover:text-ink-foreground",
                    )}
                  >
                    <Icon aria-hidden className="size-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function RailContent({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col bg-ink text-ink-foreground">
      <div className="flex items-center gap-3 border-b border-ink-border px-5 py-5">
        <span
          aria-hidden
          className="flex size-9 items-center justify-center rounded-lg border border-ink-border bg-ink-foreground/8"
        >
          <Waves className="size-5 text-ink-foreground" />
        </span>
        <div className="min-w-0">
          <p className="text-base font-semibold tracking-[0.12em] text-ink-foreground">{BRAND.name}</p>
          <p className="text-[0.7rem] leading-snug text-ink-muted">Marine environmental intelligence</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <NavList onNavigate={onNavigate} />
      </div>

      <div className="space-y-3 border-t border-ink-border p-3">
        <AskMarea />
        <div className="rounded-lg border border-ink-border px-3 py-2.5">
          <p className="text-[0.7rem] text-ink-muted">Live IoT link</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-ink-foreground">
            <span aria-hidden className="size-2 rounded-full bg-pending" />
            Not connected
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-ink-border lg:block">
        <RailContent />
      </aside>

      {/* Mobile bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-ink-border bg-ink px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <Waves aria-hidden className="size-5 text-ink-foreground" />
          <span className="text-base font-semibold tracking-[0.12em] text-ink-foreground">{BRAND.name}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="flex size-10 items-center justify-center rounded-lg border border-ink-border text-ink-foreground"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 top-[57px] z-30 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/30"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-raised">
            <RailContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <main id="main" className="lg:pl-64">
        <div className="mx-auto w-full max-w-[84rem] space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
