"use client";

import React, { useEffect, useState, useRef } from "react";
import { Eye } from "lucide-react";

interface ViewsTrackerProps {
  slug: string;
  initialViews: number;
}

/**
 * Premium client-side Blog Views Tracker Component.
 * Visualizes the total views in real-time and logs the unique page views in the background.
 */
export function BlogViewsTracker({ slug, initialViews }: ViewsTrackerProps) {
  const [views, setViews] = useState(initialViews);
  const tracked = useRef(false);

  useEffect(() => {
    // Prevent double counting during dev strict mode / component hydration double pings
    if (tracked.current) return;
    tracked.current = true;

    async function incrementViews() {
      try {
        const response = await fetch("/api/views", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && typeof data.views === "number") {
            setViews(data.views);
          }
        }
      } catch (err) {
        console.warn("Failed to dynamically log page view:", err);
      }
    }

    // Increment in the background
    incrementViews();
  }, [slug]);

  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground bg-primary/5 border border-primary/10 rounded-full px-3 py-1 animate-fade-in shadow-sm select-none">
      <Eye className="h-3.5 w-3.5 text-brand-500 animate-pulse" />
      <span>{views.toLocaleString()} views</span>
    </div>
  );
}
