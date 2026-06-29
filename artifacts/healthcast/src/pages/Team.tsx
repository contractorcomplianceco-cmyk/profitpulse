import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/auth/types";
import { Mail, UserPlus } from "lucide-react";
import { useLocation } from "wouter";

export default function TeamPage() {
  const { canAccessSettings, invitations, inviteUser, revokeInvite } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("viewer");

  if (!canAccessSettings) {
    navigate("/");
    return null;
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await inviteUser(email, role);
    if (result.ok) {
      toast({
        title: "Invitation created",
        description: `Placeholder invite sent to ${email}. Token: ${result.invitation?.token?.slice(0, 12)}…`,
      });
      setEmail("");
    } else {
      toast({ title: "Invite failed", description: result.error, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      <PageHeader
        title="Team & Invitations"
        description="Invite users to this workspace. Email delivery is not wired yet — invitations are stored locally as a placeholder."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Invite member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="gap-2">
              <Mail className="w-4 h-4" /> Send invite
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending invitations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invitations yet.</p>
          ) : (
            invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-semibold">{inv.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {inv.role} · {inv.status} · expires {new Date(inv.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                {inv.status === "pending" && (
                  <Button size="sm" variant="outline" onClick={() => revokeInvite(inv.id)}>
                    Revoke
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
