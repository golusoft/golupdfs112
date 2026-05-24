import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="GoluPDFs home">
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-600 shadow-lg shadow-brand-500/40">
        <span className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-60 transition group-hover:opacity-90" />
        <svg viewBox="0 0 24 24" fill="none" className="relative h-5 w-5 text-white" aria-hidden="true">
          <path
            d="M6 3h8l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.18)"
          />
          <path d="M14 3v5h4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path
            d="M8.5 13.5h2a1.5 1.5 0 0 1 0 3h-2v-3zm0 0v5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight">
          Golu<span className="gradient-text">PDFs</span>
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          PDF Studio
        </span>
      </span>
    </Link>
  );
}
