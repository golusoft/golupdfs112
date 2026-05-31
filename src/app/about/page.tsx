import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaSection } from "@/components/home/cta";
import { buildMetadata } from "@/lib/seo";
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Zap, 
  Heart, 
  Sparkles,
  BookOpen
} from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "About Golu Kumar & The Mission Behind GoluPDFs",
  description:
    "Meet Golu Kumar, an Economics student and digital creator from Bihar, India. Learn how he built GoluPDFs to provide 100% free, fast, and privacy-first PDF tools.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="relative pt-32 pb-24 overflow-hidden bg-background">
        {/* Background glowing effects for rich premium look */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-3/4 left-1/3 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="container max-w-6xl px-4 sm:px-6">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              MEET THE CREATOR
            </span>
            <h1 className="mt-6 font-display text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl text-foreground">
              Crafting a modern <span className="gradient-text">PDF Studio</span>, from Bihar to the World
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
              Meet the mission and the story of Golu Kumar, an Economics student who built a privacy-first, ultra-fast online workspace to simplify document workflows for everyone.
            </p>
          </div>

          {/* Creator Profile Grid */}
          <div className="grid gap-12 lg:grid-cols-12 items-start mb-24">
            
            {/* Story (Left Side - 7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-muted-foreground text-pretty text-base sm:text-lg">
              <h2 className="text-3xl font-bold tracking-tight text-foreground font-display flex items-center gap-3">
                <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                The Story Behind GoluPDFs
              </h2>
              
              <p>
                Hi, I'm <strong className="text-foreground font-medium">Golu Kumar</strong>, the creator and founder of <strong className="text-foreground font-medium">GoluPDFs</strong>. 
                I am an Economics student, digital enthusiast, and content writer based in Bihar, India.
              </p>
              
              <p>
                As a student and online creator, my daily routine involved managing a massive volume of PDF documents — studying notes, uploading assignments, drafting documents, and generating reports. 
                But I constantly faced a frustrating problem: the available online PDF tools were either painfully slow, cluttered with annoying ads, locked behind expensive subscription paywalls, or raised serious security concerns by forcing me to upload private files to their external servers.
              </p>

              <blockquote className="border-l-4 border-primary bg-primary/5 rounded-r-xl p-5 my-6 italic text-foreground">
                "I realized that document utility tools shouldn't be expensive, filled with trackers, or complicated. They should be clean, fast, secure, and available to anyone, anywhere, completely for free."
              </blockquote>

              <p>
                That simple realization inspired me to build GoluPDFs. I wanted to create a platform that respects user privacy by performing all PDF compilations directly inside the user's browser, eliminating data security risks, while providing a clean, premium experience that feels as slick as the best apps in the world.
              </p>

              <p>
                Whether you need to compress, merge, split, convert, sign, redact, or organize documents, GoluPDFs is built to serve students, developers, freelancers, and businesses with zero complexity.
              </p>
            </div>

            {/* Profile Card (Right Side - 5 Cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="relative group rounded-3xl border border-primary/10 bg-card/60 p-8 shadow-2xl backdrop-blur-md overflow-hidden hover:border-primary/20 transition-all duration-300">
                {/* Micro-glow on hover */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white font-display text-2xl font-bold shadow-lg">
                    GK
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Golu Kumar</h3>
                    <p className="text-sm text-primary font-medium">Founder & Lead Creator</p>
                  </div>
                </div>

                {/* Profile Details List */}
                <div className="space-y-4 border-t border-border/80 pt-6">
                  {[
                    { icon: GraduationCap, label: "Education", value: "Economics Student" },
                    { icon: MapPin, label: "Based In", value: "Bihar, India" },
                    { icon: Briefcase, label: "Passions", value: "Tech, Digital Tools, Content Creation" },
                    { icon: BookOpen, label: "Mission", value: "Free productivity tools for all" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dynamic greeting signature */}
                <div className="mt-8 border-t border-border/80 pt-6 text-center">
                  <p className="font-display italic text-lg text-foreground">Golu Kumar</p>
                  <p className="text-xs text-muted-foreground mt-1">GoluPDFs - Built with Passion</p>
                </div>
              </div>
            </div>

          </div>

          {/* What We Focus On (Pillars Grid) */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">
                Our Core Pillars
              </h2>
              <p className="mt-4 text-muted-foreground">
                GoluPDFs is engineered around four essential core values designed to make your daily digital workflow seamless.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Zap,
                  title: "Fast & Lightweight",
                  desc: "Instantly compile, compress, and edit PDFs. Our local processing engine runs files in milliseconds."
                },
                {
                  icon: ShieldCheck,
                  title: "100% Private & Secure",
                  desc: "Your files never leave your browser. Zero uploads to external servers ensures absolute document privacy."
                },
                {
                  icon: Sparkles,
                  title: "Premium Free Experience",
                  desc: "Access premium tools without expensive monthly subscriptions or annoying ad-block prompts."
                },
                {
                  icon: User,
                  title: "Built for Everyone",
                  desc: "Intuitive workflows designed specifically for students, freelancers, small business owners, and professionals."
                }
              ].map((pillar, idx) => (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-primary/5 bg-card p-6 shadow-sm hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5">
                    <pillar.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
