import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How GoluPDFs handles your data: short answer — we don't. All processing happens in your browser.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <article className="container max-w-3xl">
          <h1 className="font-display text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: May 24, 2026</p>

          <div className="mt-10 space-y-8 text-base leading-relaxed text-foreground/85">
            <Section title="The short version">
              <p>
                GoluPDFs processes your files entirely in your browser. We do not upload, store,
                transmit, or log your documents. Files never leave your device.
              </p>
            </Section>

            <Section title="What we do collect">
              <ul className="ml-5 list-disc space-y-2">
                <li>
                  <strong>Anonymous usage analytics</strong> — page views, tool usage counts and
                  aggregate performance metrics via Google Analytics 4. No personally identifiable
                  information.
                </li>
                <li>
                  <strong>Crash reports</strong> — anonymous error details to help us fix bugs.
                </li>
                <li>
                  <strong>Cookies</strong> — strictly necessary cookies for theme preference,
                  session authentication (admin only), and ad personalization (where AdSense is
                  enabled).
                </li>
              </ul>
            </Section>

            <Section title="What we never collect">
              <ul className="ml-5 list-disc space-y-2">
                <li>The contents of your PDFs or images</li>
                <li>Your file names</li>
                <li>Your IP address (beyond temporary GA4 anonymization)</li>
                <li>Personal information of any kind from anonymous visitors</li>
              </ul>
            </Section>

            <Section title="Third-party services">
              <p>
                We use Google Analytics 4 (with IP anonymization), Google AdSense, Vercel hosting,
                Supabase for optional feedback storage, and UptimeRobot for status monitoring.
                Each service is bound by our Data Processing Agreement.
              </p>
            </Section>

            <Section title="Your rights">
              <p>
                Under GDPR and CCPA, you have the right to access, delete or export any data we
                hold about you. Email{" "}
                <a className="text-primary underline" href="mailto:privacy@golupdfs.com">
                  privacy@golupdfs.com
                </a>{" "}
                and we'll respond within 30 days.
              </p>
            </Section>

            <Section title="Changes">
              <p>
                We'll update this policy if our practices change. Material changes will be flagged
                on the homepage for at least 30 days.
              </p>
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
