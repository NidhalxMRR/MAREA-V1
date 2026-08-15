import { useState } from "react";
import { MessageSquareText, Sparkle, SendHorizonal, ShieldCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { StatusChip } from "./primitives";
import { cn } from "@/lib/utils";

const DEFAULT_QUESTIONS = [
  "Summarize conditions at this site",
  "Explain this temperature trend",
  "Is the temperature changing unusually fast?",
  "What does the seasonal reference mean?",
  "Is the sensor reporting normally?",
];

export type AskMareaVariant = "rail" | "inline" | "ghost";

/**
 * UX shell only. No assistant backend is wired in this phase.
 * The `questions` prop lets each surface offer page-relevant prompts.
 */
export function AskMarea({
  className,
  variant = "rail",
  label = "Ask MAREA",
  questions,
}: {
  className?: string;
  variant?: AskMareaVariant;
  label?: string;
  questions?: string[];
}) {
  const [open, setOpen] = useState(false);
  const list = questions ?? DEFAULT_QUESTIONS;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg text-sm font-medium transition-colors",
            variant === "rail" &&
              "min-h-11 w-full border border-ink-border bg-ink-foreground/5 px-3 text-ink-foreground hover:bg-ink-foreground/10",
            variant === "inline" &&
              "min-h-11 w-full border border-border bg-surface px-3 text-foreground hover:border-border-strong",
            variant === "ghost" &&
              "min-h-9 px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground",
            className,
          )}
        >
          <MessageSquareText aria-hidden className={cn("shrink-0", variant === "ghost" ? "size-3.5" : "size-4")} />
          {label}
          {variant !== "ghost" ? (
            <span
              className={cn(
                "ml-auto text-[0.65rem] font-normal",
                variant === "rail" ? "text-ink-muted" : "text-muted-foreground",
              )}
            >
              Soon
            </span>
          ) : null}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-5 text-left">
          <div className="flex items-center gap-2">
            <Sparkle aria-hidden className="size-4 text-primary" />
            <SheetTitle className="text-base">Ask MAREA</SheetTitle>
          </div>
          <SheetDescription className="text-sm leading-relaxed">
            An environmental assistant grounded in MAREA's own measurements, seasonal reference and data
            quality checks — not a general chatbot.
          </SheetDescription>
          <StatusChip tone="pending" className="mt-1 w-fit">
            Not yet available
          </StatusChip>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div>
            <p className="eyebrow mb-2">Questions for this screen</p>
            <ul className="space-y-2">
              {list.map((s) => (
                <li
                  key={s}
                  className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <p className="flex items-start gap-2 rounded-lg border border-border px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck aria-hidden className="mt-px size-3.5 shrink-0" />
            Answers will name the data they rely on and will decline when the underlying source is not
            connected, so an operator is never given a confident answer built on absent measurements.
          </p>
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
            <input
              disabled
              aria-label="Ask MAREA a question (not yet available)"
              placeholder="Assistant connects in a later phase"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <SendHorizonal aria-hidden className="size-4 text-border-strong" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
