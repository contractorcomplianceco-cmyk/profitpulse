import { useAuth } from "@/context/AuthProvider";
import { loadPersistedSession } from "@/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthSession() {
  const { session, user, tenant, canWrite, canAccessSettings, rememberMe, memberships } = useAuth();
  const persisted = loadPersistedSession();

  const payload = {
    authenticated: !!session,
    session,
    persisted: persisted
      ? {
          accessExpiresAt: new Date(persisted.accessExpiresAt).toISOString(),
          refreshExpiresAt: new Date(persisted.refreshExpiresAt).toISOString(),
          rememberMe: persisted.rememberMe,
        }
      : null,
    user,
    tenant,
    memberships,
    permissions: {
      canWrite,
      canAccessSettings,
    },
    rememberMe,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>/auth/session</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-secondary/30 rounded-lg p-4 overflow-auto border border-border">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
