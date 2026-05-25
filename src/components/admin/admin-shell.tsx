"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wrench,
  Search,
  DollarSign,
  MessagesSquare,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Tool analytics", href: "/admin/tools", icon: Wrench },
  { label: "SEO & Search Console", href: "/admin/seo", icon: Search },
  { label: "AI Blog Writer", href: "/admin/blog-writer", icon: Sparkles },
  { label: "AdSense revenue", href: "/admin/revenue", icon: DollarSign },
  { label: "Feedback", href: "/admin/feedback", icon: MessagesSquare },
  { label: "Site health", href: "/admin/health", icon: Activity },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Signed out");
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar (mobile) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-md lg:hidden">
        <Logo />
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-card/40 backdrop-blur-md lg:flex lg:flex-col">
          <div className="flex h-16 items-center border-b px-5">
            <Logo />
          </div>
          <nav className="flex-1 space-y-0.5 p-3">
            {NAV.map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-active"
                      className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-gradient-to-b from-brand-500 to-fuchsia-500"
                    />
                  )}
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-3">
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 text-xs font-bold text-white">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{email}</p>
                  <p className="text-[10px] text-muted-foreground">Owner · Admin</p>
                </div>
              </div>
              <div className="mt-3 flex gap-1">
                <ThemeToggle />
                <Button variant="ghost" size="sm" className="flex-1" onClick={logout}>
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Drawer (mobile) */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 250 }}
                className="absolute left-0 top-0 h-full w-72 bg-background p-5 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <Logo />
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="mt-6 space-y-0.5">
                  {NAV.map((n) => {
                    const active = pathname === n.href;
                    return (
                      <Link
                        key={n.href}
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                          active ? "bg-accent text-foreground" : "text-muted-foreground"
                        )}
                      >
                        <n.icon className="h-4 w-4" />
                        {n.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-6 flex gap-2 border-t pt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={logout}>
                    <LogOut className="h-3.5 w-3.5" /> Sign out
                  </Button>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="hidden border-b bg-card/40 px-6 py-4 backdrop-blur-md lg:flex lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Admin
              </p>
              <h1 className="font-display text-xl font-bold">
                {NAV.find((n) => n.href === pathname)?.label || "Dashboard"}
              </h1>
            </div>
            <Button asChild variant="gradient" size="sm">
              <Link href="/" target="_blank">
                <Sparkles className="h-3.5 w-3.5" /> View site
              </Link>
            </Button>
          </div>
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
