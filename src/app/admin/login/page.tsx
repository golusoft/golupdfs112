import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/auth";
import { Logo } from "@/components/layout/logo";
import { buildMetadata } from "@/lib/seo";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Admin Login",
  path: "/admin/login",
  noindex: true,
});

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070c] text-slate-100 flex items-center justify-center">
      {/* Dynamic Ambient Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[100px] animate-float pointer-events-none" />

      {/* Background patterns */}
      <div
        className="absolute inset-0 dot-pattern opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 grid-pattern opacity-[0.03] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden
      />

      <div className="container relative z-10 flex min-h-screen items-center justify-center py-16 px-4">
        <div className="w-full max-w-[440px] animate-fade-in-up">
          {/* Logo container */}
          <div className="flex justify-center mb-8">
            <div className="scale-110 hover:scale-105 transition-transform duration-300">
              <Logo />
            </div>
          </div>

          {/* Premium Gradient Border Glassmorphic Wrapper */}
          <div className="relative p-[1px] bg-gradient-to-b from-white/15 via-white/[0.04] to-white/15 rounded-3xl shadow-2xl shadow-black/80 backdrop-blur-2xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-fuchsia-500 rounded-3xl opacity-20 blur-xl pointer-events-none" />
            
            {/* Inner Content Box */}
            <div className="relative bg-[#0d121f]/90 dark:bg-[#0d121f]/90 rounded-[23px] p-8 md:p-10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6 tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure Gate
              </div>

              <h1 className="font-display text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                Admin Sign-In
              </h1>
              <p className="mt-2 text-sm text-slate-400 font-medium">
                Restricted gateway. Authorized operators only.
              </p>

              {/* Login Form component */}
              <div className="mt-8">
                <LoginForm />
              </div>
            </div>
          </div>

          {/* Footer security labels */}
          <div className="mt-8 flex flex-col items-center gap-2 text-center text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System active · End-to-end encrypted</span>
            </div>
            <p>
              Sessions are signed with HS256 and expire after 12 hours.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
