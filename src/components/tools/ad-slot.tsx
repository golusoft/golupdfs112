"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

/**
 * AdSense slot — renders only when NEXT_PUBLIC_ADSENSE_CLIENT is set.
 * Otherwise renders a tasteful "premium space" placeholder so the layout
 * never breaks during development.
 */
export function AdSlot({ slot, format = "auto", className }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) return;
    try {
      const win = window as unknown as { adsbygoogle?: Record<string, unknown>[] };
      (win.adsbygoogle = win.adsbygoogle || []).push({});
    } catch {
      /* noop */
    }
  }, [client]);

  if (!client) {
    return (
      <div
        className={cn(
          "flex min-h-[120px] items-center justify-center rounded-xl border border-dashed bg-muted/40 text-xs text-muted-foreground",
          className
        )}
        aria-hidden
      >
        <span>Premium ad slot</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("min-h-[120px]", className)}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
