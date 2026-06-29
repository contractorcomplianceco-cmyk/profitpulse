import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CcaLogo } from "@/components/layout/CcaLogo";
import { DEFAULT_TENANT_NAME } from "@/auth/types";
import { Checkbox } from "@/components/ui/checkbox";
import { demoConfig } from "@/brand/demoMode";
import { PlayCircle } from "lucide-react";

export default function AuthLogin() {
  const { login, session } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("demo");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await login(email, password, rememberMe);
    setSubmitting(false);
    if (result.ok) {
      navigate("/");
    } else {
      setError(result.error ?? "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50/40 p-6">
      <Card className="w-full max-w-md shadow-lg border-border/80">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <CcaLogo className="w-14 h-14" />
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight">Sign in to Profit Pulse</CardTitle>
          <CardDescription>
            Multi-tenant SaaS workspace — default tenant <strong>{DEFAULT_TENANT_NAME}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/demo/">
            <Button type="button" variant="default" className="w-full gap-2 mb-5">
              <PlayCircle className="w-4 h-4" />
              {demoConfig.enterDemoLabel}
            </Button>
          </Link>
          <p className="text-center text-xs text-muted-foreground mb-5 -mt-2">
            Video walkthrough first — sample data, no login required.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 border-t border-border pt-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo"
              />
              <p className="text-xs text-muted-foreground">
                Mock auth — password is not verified yet. Use demo accounts below.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(v === true)}
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Keep me signed in for 30 days
              </Label>
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-secondary/30 border border-border p-3 text-xs space-y-1.5">
            <p className="font-semibold uppercase tracking-wide text-muted-foreground">Demo accounts</p>
            <p><span className="font-mono">admin@demo.com</span> — full access (+ Acme workspace switch)</p>
            <p><span className="font-mono">manager@demo.com</span> — no system settings</p>
            <p><span className="font-mono">viewer@demo.com</span> — read-only</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
