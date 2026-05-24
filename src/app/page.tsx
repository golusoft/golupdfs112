import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { UploadSpotlight } from "@/components/home/upload-spotlight";
import { ToolGrid } from "@/components/home/tool-grid";
import { FeaturesSection } from "@/components/home/features";
import { StatsSection } from "@/components/home/stats";
import { TestimonialsSection } from "@/components/home/testimonials";
import { FaqSection } from "@/components/home/faq";
import { CtaSection } from "@/components/home/cta";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free Online PDF Tools",
  description:
    "30+ premium browser-based PDF tools — compress, merge, split, convert, sign, edit. No upload, no signup, no watermarks. The modern PDF Studio.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <UploadSpotlight />
        <ToolGrid />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
