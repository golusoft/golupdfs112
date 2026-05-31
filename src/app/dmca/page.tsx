import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { buildMetadata } from "@/lib/seo";
import { Scale, ShieldAlert, AlertCircle, FileText, UserCheck, Gavel, HelpCircle } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "DMCA Copyright Policy — Local Sandbox Disclaimers",
  description:
    "GoluPDFs DMCA Compliance Policy. Review our zero-hosting copyright disclaimer, designated DMCA agent details, and filing protocols.",
  path: "/dmca",
});

export default function DmcaPage() {
  return (
    <>
      <Navbar />
      <main className="relative pt-32 pb-24 overflow-hidden bg-background">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="container max-w-6xl px-4 sm:px-6">
          
          {/* Header Area */}
          <div className="max-w-3xl mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase backdrop-blur-md">
              <Scale className="h-3.5 w-3.5 text-primary" />
              DMCA COMPLIANCE
            </span>
            <h1 className="mt-6 font-display text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl text-foreground">
              DMCA Copyright Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: May 31, 2026</p>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              GoluPDFs respects the intellectual property rights of creators and is committed to complying with the Digital Millennium Copyright Act (DMCA). This policy outlines our copyright compliance frameworks.
            </p>
          </div>

          {/* Grid Layout: Sticky TOC + Content */}
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            
            {/* Sticky Table of Contents (Left 4 Cols) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
              <div className="rounded-2xl border border-primary/10 bg-card/60 p-6 backdrop-blur-md shadow-lg">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 font-display">
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {[
                    { id: "dmca-overview", label: "1. DMCA Overview" },
                    { id: "sandbox-disclaimer", label: "2. Sandbox Disclaimer" },
                    { id: "filing-notice", label: "3. Filing a Takedown Notice" },
                    { id: "counter-notice", label: "4. Counter-Notification" },
                    { id: "designated-agent", label: "5. Designated Agent" },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block py-2 px-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Secure Sandbox Alert Badge */}
              <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-5 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Zero Hosting Server</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    We host zero user files. GoluPDFs possesses no technological capacity to access or delete documents processed in your browser.
                  </p>
                </div>
              </div>
            </aside>

            {/* DMCA Detailed Text (Right 8 Cols) */}
            <div className="lg:col-span-8 space-y-12 text-muted-foreground text-base sm:text-lg leading-relaxed text-pretty">
              
              <section id="dmca-overview" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Gavel className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  1. DMCA Copyright Overview
                </h2>
                <p>
                  The Digital Millennium Copyright Act (Title 17, United States Code, Section 512) provides a clear legal shield for online service providers who inadvertently process or transmit content that violates third-party copyrights.
                </p>
                <p>
                  GoluPDFs maintains a strict policy to act quickly when notified of valid copyright claims on our website content (such as blog posts, text guides, or custom visual themes).
                </p>
              </section>

              <section id="sandbox-disclaimer" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  2. Critical Sandbox Copyright Disclaimer (Must Read)
                </h2>
                <p>
                  **GoluPDFs does NOT host, cache, store, or index any user documents or uploaded files.**
                </p>
                <div className="rounded-2xl border border-destructive/10 bg-destructive/5 p-6 flex items-start gap-4 my-6">
                  <ShieldAlert className="h-6 w-6 text-destructive shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Important Copyright Reality</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      Every tool on GoluPDFs executes 100% locally in the individual user's web browser sandbox. The file processing happens purely on the user's local device hardware (client-side). Because your documents are never uploaded to our servers, GoluPDFs does not hold copies of any processed intellectual property. We are technically incapable of deleting, purging, or blocking document contents processed locally by visitors.
                    </p>
                  </div>
                </div>
                <p>
                  If you believe a user is processing your copyrighted material using our local client-side calculators or compilers, that action is occurring entirely on their personal machine. GoluPDFs has no server-side access to stop it.
                </p>
              </section>

              <section id="filing-notice" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  3. Filing a Takedown Notice
                </h2>
                <p>
                  If you find static material hosted directly on our website (such as custom blog text, tutorial layouts, website graphics, or core calculator assets) that you believe infringes your copyrighted work, you can submit a formal DMCA takedown notice.
                </p>
                <p>
                  A valid DMCA notification must be sent to our Designated DMCA Agent (detailed in Section 5) and must contain the following written information:
                </p>
                <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed">
                  <li>An electronic or physical signature of the person authorized to act on behalf of the copyright owner.</li>
                  <li>A clear identification of the copyrighted work claimed to have been infringed.</li>
                  <li>The specific URL link on GoluPDFs containing the alleged infringing content.</li>
                  <li>Your physical address, telephone number, and active email address.</li>
                  <li>A statement that you have a good-faith belief that use of the material is not authorized by the copyright owner.</li>
                  <li>A statement made under penalty of perjury that the information in the notification is accurate and that you are the copyright owner or authorized agent.</li>
                </ul>
              </section>

              <section id="counter-notice" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  4. Counter-Notification Procedures
                </h2>
                <p>
                  If your content has been taken down under this DMCA protocol and you believe that this was a result of a mistake or misidentification, you have the right to file a written counter-notification.
                </p>
                <p>
                  A valid counter-notification must be sent to our designated agent and include:
                </p>
                <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed">
                  <li>Your physical or electronic signature.</li>
                  <li>Identification of the material that was removed and the URL where it was previously visible.</li>
                  <li>A statement under penalty of perjury that you have a good faith belief that the material was removed as a result of mistake or misidentification.</li>
                  <li>Your name, address, phone number, and a statement that you consent to the jurisdiction of the federal court in your district, or if outside the US, the judicial courts in India, and that you will accept service of process from the original DMCA filer.</li>
                </ul>
              </section>

              <section id="designated-agent" className="scroll-mt-32 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  5. Designated DMCA Agent
                </h2>
                <p>
                  Please address all DMCA copyright claims, counter-notifications, and legal inquiries directly to Golu Kumar, the operator and data controller of GoluPDFs:
                </p>
                
                <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-2 text-sm font-medium">
                  <p className="text-foreground"><span className="text-muted-foreground uppercase text-xs block tracking-wider mb-0.5">Designated Agent</span> Golu Kumar</p>
                  <p className="text-foreground"><span className="text-muted-foreground uppercase text-xs block tracking-wider mb-0.5">Legal Department</span> GoluPDFs Legal Affairs</p>
                  <p className="text-foreground"><span className="text-muted-foreground uppercase text-xs block tracking-wider mb-0.5">Location</span> Bihar, India</p>
                  <p className="text-foreground">
                    <span className="text-muted-foreground uppercase text-xs block tracking-wider mb-0.5">Official DMCA Email</span> 
                    <a className="text-primary hover:underline font-semibold" href="mailto:lgdemon402lkr@gmail.com">lgdemon402lkr@gmail.com</a>
                  </p>
                </div>

                <p className="mt-4">
                  All compliance claims are analyzed and processed diligently in less than 24 to 48 business hours.
                </p>
              </section>

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
