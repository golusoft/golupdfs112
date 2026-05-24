import type { Metadata } from "next";
import { Mail, Twitter, Github } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with the GoluPDFs team. We respond within one business day.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container max-w-3xl">
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Let's <span className="gradient-text">talk.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Questions, partnerships, enterprise needs or feedback — we read every message.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <ContactCard
              icon={Mail}
              title="Email"
              detail="hello@golupdfs.com"
              href="mailto:hello@golupdfs.com"
            />
            <ContactCard
              icon={Twitter}
              title="Twitter / X"
              detail="@golupdfs"
              href="https://twitter.com/golupdfs"
            />
            <ContactCard
              icon={Github}
              title="GitHub"
              detail="github.com/golupdfs"
              href="https://github.com/golupdfs"
            />
            <ContactCard
              icon={Mail}
              title="Press"
              detail="press@golupdfs.com"
              href="mailto:press@golupdfs.com"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { LucideIcon } from "lucide-react";

function ContactCard({
  icon: Icon,
  title,
  detail,
  href,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
  href: string;
}) {
  return (
    <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-6">
        <a href={href} className="flex items-center gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white shadow-md">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{detail}</p>
          </div>
        </a>
      </CardContent>
    </Card>
  );
}
