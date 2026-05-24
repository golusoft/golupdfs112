import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container flex min-h-[70vh] items-center justify-center pt-32">
        <div className="text-center">
          <p className="font-mono text-sm font-medium text-primary">404</p>
          <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
            <span className="gradient-text">Page not found</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            We couldn't find what you were looking for. Try the toolset below.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="gradient">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" /> Go home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tools">
                <Search className="h-4 w-4" /> Browse all tools
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
