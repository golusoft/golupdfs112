import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms of Service for GoluPDFs.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <article className="container max-w-3xl">
          <h1 className="font-display text-5xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: May 24, 2026</p>

          <div className="mt-10 space-y-8 text-base leading-relaxed text-foreground/85">
            <Section title="Acceptance">
              <p>
                By using GoluPDFs you agree to these terms. If you do not agree, please don't use the service.
              </p>
            </Section>

            <Section title="The service">
              <p>
                GoluPDFs provides browser-based PDF tools. The service is provided "as is" without any warranty. We aim
                for 99.9% uptime but do not guarantee uninterrupted availability.
              </p>
            </Section>

            <Section title="Acceptable use">
              <p>
                You agree not to use GoluPDFs for any illegal purpose, including but not limited to: processing
                copyrighted material without rights, evading software DRM, or attempting to circumvent the security of
                any third-party document.
              </p>
            </Section>

            <Section title="Liability">
              <p>
                Because all processing happens in your browser, you are solely responsible for any data loss or
                corruption. We strongly recommend keeping a backup of your original files.
              </p>
            </Section>

            <Section title="Changes">
              <p>We may update these terms at any time. Continued use means acceptance.</p>
            </Section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
