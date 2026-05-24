import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/auth";
import { Logo } from "@/components/layout/logo";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Login",
  path: "/admin/login",
  noindex: true,
});

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="relative min-h-screen overflow-hidden bg-mesh-1">
      <div
        className="absolute inset-0 dot-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        aria-hidden
      />
      <div className="container flex min-h-screen items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="mt-8 glass-strong rounded-3xl p-8 shadow-2xl">
            <h1 className="font-display text-2xl font-bold tracking-tight">Admin sign-in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Restricted area. Authorized personnel only.
            </p>
            <div className="mt-6">
              <LoginForm />
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Sessions are signed with HS256 and expire after 12 hours.
          </p>
        </div>
      </div>
    </main>
  );
}
