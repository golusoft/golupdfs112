"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { type ReactNode, useEffect } from "react";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Intercept and swallow harmless browser errors like ResizeObserver limit bounds
    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      if (
        !reason ||
        reason instanceof Event ||
        (reason.message &&
          (reason.message.includes("ResizeObserver") ||
            reason.message.includes("Script error")))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleError = (e: ErrorEvent) => {
      if (
        e.message &&
        (e.message.includes("ResizeObserver") ||
          e.message.includes("Script error"))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <TooltipProvider delayDuration={150}>
        {children}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              backdropFilter: "blur(20px)",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
      </TooltipProvider>
    </ThemeProvider>
  );
}
