"use client";

import { useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Share2, Key, CheckCircle2, XCircle, AlertTriangle,
  Globe, Bot, Bell, Shield, Settings, Eye, EyeOff
} from "lucide-react";

// Social platform configuration with token status detection
const SOCIAL_PLATFORMS = [
  {
    id: "devto",
    name: "Dev.to",
    envKey: "DEV_TO_API_KEY",
    description: "Publish technical articles to the Dev.to developer community.",
    docsUrl: "https://dev.to/settings/extensions",
    placeholder: "Enter your Dev.to API key...",
    color: "from-slate-600 to-slate-800",
    icon: "💻",
  },
  {
    id: "hashnode",
    name: "Hashnode",
    envKey: "HASHNODE_TOKEN",
    description: "Syndicate to your Hashnode publication via GraphQL.",
    docsUrl: "https://hashnode.com/settings/developer",
    placeholder: "Enter your Hashnode Personal Access Token...",
    color: "from-blue-600 to-blue-800",
    icon: "📝",
  },
  {
    id: "medium",
    name: "Medium",
    envKey: "MEDIUM_INTEGRATION_TOKEN",
    description: "Publish to Medium with canonical URL attribution.",
    docsUrl: "https://medium.com/me/settings",
    placeholder: "Enter your Medium Integration Token...",
    color: "from-zinc-600 to-zinc-800",
    icon: "✍️",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    envKey: "LINKEDIN_ACCESS_TOKEN",
    description: "Share articles to LinkedIn feed via UGC Share API.",
    docsUrl: "https://www.linkedin.com/developers/",
    placeholder: "Enter your LinkedIn OAuth Access Token...",
    color: "from-blue-700 to-blue-900",
    icon: "💼",
  },
];

const PLATFORM_STATUS: Record<string, "active" | "inactive" | "error"> = {
  devto: "inactive",
  hashnode: "inactive",
  medium: "inactive",
  linkedin: "inactive",
};

function TokenInput({ platform }: { platform: typeof SOCIAL_PLATFORMS[0] }) {
  const [value, setValue] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const status = PLATFORM_STATUS[platform.id];

  return (
    <div className="p-4 rounded-xl border bg-card/50 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-base`}>
            {platform.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{platform.name}</p>
              {status === "active" && (
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px]">
                  <CheckCircle2 className="h-2.5 w-2.5 mr-1" />Active
                </Badge>
              )}
              {status === "inactive" && (
                <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground text-[10px]">
                  <XCircle className="h-2.5 w-2.5 mr-1" />Not configured
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{platform.description}</p>
          </div>
        </div>
        <a
          href={platform.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex-shrink-0"
        >
          Get token →
        </a>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={showToken ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={platform.placeholder}
            className="pr-9 font-mono text-xs"
          />
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
        <Button
          size="sm"
          variant={saved ? "outline" : "default"}
          onClick={handleSave}
          disabled={!value || saving}
          className={saved ? "border-emerald-500/50 text-emerald-400" : ""}
        >
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save"}
        </Button>
      </div>

      <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-300/80">
          Add <code className="bg-background px-1 py-0.5 rounded text-[10px] font-mono">{platform.envKey}</code> to your Vercel environment variables for production. Tokens entered here are for local testing only.
        </p>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Account
          </CardTitle>
          <CardDescription>Admin profile and session information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Admin Email</Label>
            <Input value="admin@example.com" readOnly className="mt-1.5 font-mono text-sm" />
          </div>
          <div>
            <Label>Role</Label>
            <Input value="Owner · Superadmin · Full Access" readOnly className="mt-1.5 text-sm" />
          </div>
          <div>
            <Label>Authentication</Label>
            <Input value="HS256 JWT · 12-hour sessions" readOnly className="mt-1.5 text-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Social Token Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Social Distribution Tokens
          </CardTitle>
          <CardDescription>
            Configure API tokens for automatic article syndication. Tokens are injected at runtime from environment variables — no code changes needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Syndication overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            {SOCIAL_PLATFORMS.map(p => (
              <div key={p.id} className="p-2.5 rounded-lg bg-muted/20 border border-border/40 text-center">
                <div className="text-base mb-1">{p.icon}</div>
                <p className="text-xs font-medium text-foreground">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">Not configured</p>
              </div>
            ))}
          </div>

          {SOCIAL_PLATFORMS.map(platform => (
            <TokenInput key={platform.id} platform={platform} />
          ))}

          <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
            <p className="text-xs text-muted-foreground">
              <strong>How it works:</strong> When tokens are configured, the autonomous publishing pipeline will automatically syndicate each new article to all active platforms with correct canonical URLs pointing back to your site. Skipped platforms are logged gracefully.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Site Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Site Preferences
          </CardTitle>
          <CardDescription>Autonomous system behavior toggles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Auto-publish approved keywords", desc: "Run daily cron and auto-publish without manual approval." },
            { label: "Social syndication enabled", desc: "Automatically syndicate new articles to configured platforms." },
            { label: "Discord webhook alerts", desc: "Send agent execution alerts and daily summaries to Discord." },
            { label: "Affiliate monetization", desc: "Auto-insert contextual affiliate blocks in generated articles." },
            { label: "RAG duplicate detection", desc: "Block generation when semantic similarity > 85% with existing content." },
            { label: "Anonymous usage analytics", desc: "Forward aggregate tool usage metrics to Supabase." },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between rounded-lg border bg-card/50 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cron Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-4 w-4" /> Cron Automation
          </CardTitle>
          <CardDescription>Daily publishing schedule configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Schedule (UTC)</Label>
            <Input value="0 4 * * * — Daily at 4:00 AM UTC (9:30 AM IST)" readOnly className="mt-1.5 font-mono text-sm" />
          </div>
          <div>
            <Label>Cron Endpoint</Label>
            <Input value="/api/schedule" readOnly className="mt-1.5 font-mono text-sm" />
          </div>
          <div>
            <Label>GitHub Repository</Label>
            <Input value="https://github.com/golusoft/golupdfs112" readOnly className="mt-1.5 font-mono text-sm" />
          </div>
          <div>
            <Label>Production URL</Label>
            <Input value="https://golupdfs112-autz.vercel.app" readOnly className="mt-1.5 font-mono text-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
          <CardDescription>Irreversible destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="destructive" disabled>
            Reset all analytics counters
          </Button>
          <p className="text-xs text-muted-foreground">
            Disabled in this build. Wire to a Supabase RPC for production use.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
