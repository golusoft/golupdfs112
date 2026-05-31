import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "./contact-form";
import { buildMetadata } from "@/lib/seo";
import { 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckSquare, 
  Sparkles 
} from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Contact GoluPDFs — Get Technical Support & General Help",
  description:
    "Have a question, feedback, or a feature suggestion? Contact the GoluPDFs team. We respond to all inquiries within 24-48 business hours.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="relative pt-32 pb-24 overflow-hidden bg-background">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="container max-w-6xl px-4 sm:px-6">
          
          {/* Header Area */}
          <div className="max-w-3xl mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              GET IN TOUCH
            </span>
            <h1 className="mt-6 font-display text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl text-foreground">
              Let's build a better <span className="gradient-text">document space.</span>
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              At GoluPDFs, we are committed to providing a seamless, secure, and reliable utility experience. Whether you have questions, feedback, need technical support, or want to explore collaboration opportunities, we are ready to listen.
            </p>
          </div>

          {/* Core Grid */}
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            
            {/* Left Side: Info & Commitments (6 Cols) */}
            <div className="lg:col-span-6 space-y-10">
              
              {/* Quick Contact Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-foreground font-display">
                  Direct Channels
                </h2>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Email Card */}
                  <div className="rounded-2xl border border-border/80 bg-card p-5 flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Official Email</p>
                      <a 
                        href="mailto:lgdemon402lkr@gmail.com" 
                        className="mt-1 block text-sm font-semibold text-foreground hover:text-primary transition-colors break-all"
                      >
                        lgdemon402lkr@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Location Card */}
                  <div className="rounded-2xl border border-border/80 bg-card p-5 flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">Bihar, India</p>
                    </div>
                  </div>
                </div>

                {/* Response SLA Card */}
                <div className="rounded-2xl border border-border/80 bg-card p-5 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Response Commitment</p>
                    <p className="mt-1 text-sm font-medium text-foreground leading-relaxed">
                      We value your time. Our team strives to respond to all inquiries within <strong className="text-primary">24–48 business hours</strong>. Response times may vary slightly during weekends and public holidays.
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Checkbox Info List */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-foreground font-display">
                  How We Can Help You
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 text-muted-foreground">
                  {[
                    "Technical support & troubleshooting",
                    "Questions about tools & services",
                    "Feature requests & suggestions",
                    "Partnership & collaboration",
                    "Security & privacy concerns",
                    "General feedback & inquiries"
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm">
                      <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Trust Banner */}
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Our Privacy & Security Guarantee</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    At GoluPDFs, we prioritize simplicity, security, and absolute user satisfaction. We are strictly dedicated to delivering high-quality PDF solutions while ensuring that none of your documents are ever stored or processed on our backend servers.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Side: Interactive Client Form (6 Cols) */}
            <div className="lg:col-span-6">
              <ContactForm />
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
