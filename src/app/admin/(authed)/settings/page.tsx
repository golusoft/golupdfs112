import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { getAdminSession } from "@/lib/auth";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your admin profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={session?.email || ""} readOnly className="mt-1.5" />
          </div>
          <div>
            <Label>Role</Label>
            <Input value="Owner · Admin" readOnly className="mt-1.5" />
          </div>
          <div>
            <Label>Session expires</Label>
            <Input
              value={
                session?.exp ? new Date(session.exp * 1000).toLocaleString() : "—"
              }
              readOnly
              className="mt-1.5"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site preferences</CardTitle>
          <CardDescription>Public-facing toggles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Show AdSense ads", desc: "Display the ad slots on tool pages." },
            { label: "Public AI Assistant beta", desc: "Show the AI Assistant tool in the public catalog." },
            { label: "Anonymous usage analytics", desc: "Forward aggregate metrics to Supabase." },
            { label: "New feedback notifications", desc: "Email me when a user submits feedback." },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between rounded-lg border bg-card/50 p-3">
              <div>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>
            Reset all analytics counters
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Disabled in this build. Wire to a Supabase RPC for full reset.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
