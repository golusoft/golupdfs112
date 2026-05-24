import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Logo } from "./logo";
import { CATEGORIES, TOOLS, type ToolCategory } from "@/lib/tools";

const RESOURCES = [
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
  { label: "DMCA", href: "/dmca" },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t bg-gradient-to-b from-background to-muted/30">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden="true"
      />
      <div className="container py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
              GoluPDFs is the modern PDF ecosystem — 30+ professional tools that run entirely in your browser. No
              uploads, no watermarks, just speed.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { icon: Twitter, href: "https://twitter.com/golupdfs", label: "Twitter" },
                { icon: Github, href: "https://github.com/golupdfs", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com/company/golupdfs", label: "LinkedIn" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-lg border bg-background/50 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
            {(Object.keys(CATEGORIES) as ToolCategory[]).slice(0, 4).map((cat) => (
              <div key={cat}>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {CATEGORIES[cat].label}
                </h4>
                <ul className="space-y-2 text-sm">
                  {TOOLS.filter((t) => t.category === cat)
                    .slice(0, 5)
                    .map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/tools/${t.slug}`}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {t.shortName}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t pt-8 md:grid-cols-3">
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resources</h4>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {RESOURCES.map((r) => (
                <li key={r.label}>
                  <Link href={r.href} className="hover:text-foreground">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legal</h4>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {LEGAL.map((r) => (
                <li key={r.label}>
                  <Link href={r.href} className="hover:text-foreground">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-sm text-muted-foreground md:text-right">
            <p>© {new Date().getFullYear()} GoluPDFs. All rights reserved.</p>
            <p className="mt-1">
              Made with care, in your browser. <span className="gradient-text font-medium">Privacy-first.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
