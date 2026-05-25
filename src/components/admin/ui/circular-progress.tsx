"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
}

export function CircularProgress({
  value,
  size = 60,
  strokeWidth = 5,
  showText = true,
  className,
  ...props
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // Determine harmonic color styling based on the score
  let strokeColor = "stroke-rose-500";
  let textColor = "text-rose-500";
  let bgColor = "bg-rose-500/10 border-rose-500/20";

  if (value >= 80) {
    strokeColor = "stroke-emerald-500";
    textColor = "text-emerald-500";
    bgColor = "bg-emerald-500/10 border-emerald-500/20";
  } else if (value >= 50) {
    strokeColor = "stroke-amber-500";
    textColor = "text-amber-500";
    bgColor = "bg-amber-500/10 border-amber-500/20";
  }

  return (
    <div
      className={cn("relative flex items-center justify-center select-none", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg className="h-full w-full -rotate-90">
        {/* Track Ring */}
        <circle
          className="stroke-muted/20"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Ring */}
        <circle
          className={cn("transition-all duration-500 ease-out", strokeColor)}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showText && (
        <span className={cn("absolute text-sm font-bold font-mono tracking-tight", textColor)}>
          {value}
        </span>
      )}
    </div>
  );
}
