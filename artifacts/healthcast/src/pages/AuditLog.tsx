import { useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAuth } from "@/context/AuthProvider";
import { listAuditLogs } from "@/auth/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ScrollText } from "lucide-react";

export default function AuditLogPage() {
  const { session, canAccessSettings } = useAuth();
  const [, navigate] = useLocation();

  const entries = useMemo(
    () => (session ? listAuditLogs(session.tenantId, 200) : []),
    [session],
  );

  if (!canAccessSettings) {
    navigate("/");
    return null;
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Audit Log"
        description="Who changed what in this workspace. Stored locally until the API persists to PostgreSQL."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ScrollText className="w-4 h-4" /> Recent activity ({entries.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/20 text-left">
                  <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">When</th>
                  <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">User</th>
                  <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Action</th>
                  <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Entity</th>
                  <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Summary</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-border/50 hover:bg-secondary/10">
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(e.at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 font-medium">{e.userEmail}</td>
                    <td className="px-4 py-2 font-mono text-xs">{e.action}</td>
                    <td className="px-4 py-2 text-xs">
                      {e.entityType}
                      {e.entityId ? ` · ${e.entityId.slice(0, 8)}…` : ""}
                    </td>
                    <td className="px-4 py-2">{e.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
