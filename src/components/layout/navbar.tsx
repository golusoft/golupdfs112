"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { CATEGORIES, TOOLS, type ToolCategory } from "@/lib/tools";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Tools", href: "/tools", hasMega: true },
  { label: "Compress", href: "/tools/compress-pdf" },
  { label: "Merge", href: "/tools/merge-pdf" },
  { label: "Convert", href: "/tools?category=convert" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "py-2" : "py-3"
        )}
      >
        <div className="container">
          <div
            className={cn(
              "flex h-14 items-center justify-between rounded-2xl px-3 transition-all duration-300",
              scrolled
                ? "glass-strong shadow-xl shadow-black/[0.04]"
                : "border border-transparent"
            )}
          >
            <div className="flex items-center gap-1">
              <Logo />
            </div>

            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((item) =>
                item.hasMega ? (
                  <button
                    key={item.label}
                    onMouseEnter={() => setMega(true)}
                    onClick={() => setMega((s) => !s)}
                    className="relative inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                    <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="relative inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-1.5">
              <Link
                href="/tools"
                className="hidden h-9 items-center gap-2 rounded-lg border bg-background/50 px-3 text-sm text-muted-foreground hover:text-foreground sm:inline-flex"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search tools…</span>
                <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
              </Link>
              <ThemeToggle />
              <Button asChild variant="gradient" size="sm" className="hidden sm:inline-flex">
                <Link href="/tools">
                  <Sparkles className="h-3.5 w-3.5" /> Get Started
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mega menu */}
          <AnimatePresence>
            {mega && (
              <motion.div
                onMouseLeave={() => setMega(false)}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 top-full z-40 mt-2 w-[min(960px,92vw)] -translate-x-1/2"
              >
                <div className="glass-strong rounded-2xl p-6 shadow-2xl">
                  <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                    {(Object.keys(CATEGORIES) as ToolCategory[]).map((cat) => {
                      const tools = TOOLS.filter((t) => t.category === cat).slice(0, 4);
                      return (
                        <div key={cat}>
                          <div className="mb-3 flex items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full bg-gradient-to-r",
                                CATEGORIES[cat].color
                              )}
                            />
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {CATEGORIES[cat].label}
                            </p>
                          </div>
                          <ul className="space-y-1">
                            {tools.map((t) => (
                              <li key={t.slug}>
                                <Link
                                  href={`/tools/${t.slug}`}
                                  onClick={() => setMega(false)}
                                  className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                                >
                                  <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-brand-500/10 to-fuchsia-500/10">
                                    <t.icon className="h-4 w-4 text-foreground/80" />
                                  </span>
                                  <span className="flex-1 text-sm font-medium">{t.shortName}</span>
                                  <ChevronRight className="h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      30+ professional tools — all free, no signup.
                    </p>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/tools">
                        View all tools <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-background p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-8 space-y-1">
                {NAV.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium hover:bg-accent"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
              <Button asChild variant="gradient" size="lg" className="mt-6 w-full">
                <Link href="/tools" onClick={() => setOpen(false)}>
                  <Sparkles className="h-4 w-4" /> Browse all tools
                </Link>
              </Button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
