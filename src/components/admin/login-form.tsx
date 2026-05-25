"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      toast.success("Identity verified successfully!");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Access denied");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
          Operator Email
        </Label>
        <div className="relative mt-1 group">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-11 h-12 bg-white/[0.02] border-white/10 hover:border-white/20 focus:border-brand-500 focus:ring-brand-500/20 text-slate-100 rounded-xl transition-all duration-200 placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
          Passkey
        </Label>
        <div className="relative mt-1 group">
          <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-11 h-12 bg-white/[0.02] border-white/10 hover:border-white/20 focus:border-brand-500 focus:ring-brand-500/20 text-slate-100 rounded-xl transition-all duration-200 placeholder:text-slate-600"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading} 
        variant="gradient" 
        size="lg" 
        className="w-full h-12 rounded-xl mt-6 font-semibold tracking-wide flex items-center justify-center gap-2 text-white hover:brightness-110 active:scale-[0.98] transition-all"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            Authenticate
          </>
        )}
      </Button>
    </form>
  );
}
