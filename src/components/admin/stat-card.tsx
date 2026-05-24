"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta?: number;
  icon: LucideIcon;
  color: string;
  decimals?: number;
}

export function StatCard({
  label,
  value,
  prefix,
  suffix,
  delta,
  icon: Icon,
  color,
  decimals = 0,
}: StatCardProps) {
  const isPos = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border bg-card p-5"
    >
      <div className={cn("absolute inset-x-0 -top-px h-px bg-gradient-to-r", color)} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold">
            {prefix}
            <AnimatedCounter value={Math.floor(value)} duration={1.2} />
            {decimals > 0 && (
              <span className="text-foreground">
                .{Math.round((value % 1) * Math.pow(10, decimals))}
              </span>
            )}
            {suffix}
          </p>
          {delta !== undefined && (
            <p
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-xs font-medium",
                isPos ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPos ? "+" : ""}
              {delta.toFixed(1)}%
              <span className="text-muted-foreground">vs last period</span>
            </p>
          )}
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br shadow-md", color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
