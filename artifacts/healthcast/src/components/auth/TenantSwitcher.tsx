import { useAuth } from "@/context/AuthProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TenantSwitcher() {
  const { tenant, availableTenants, session, switchTenant } = useAuth();
  const { toast } = useToast();

  if (!session || availableTenants.length <= 1) return null;

  const handleChange = async (tenantId: string) => {
    if (tenantId === session.tenantId) return;
    const result = await switchTenant(tenantId);
    if (result.ok) {
      toast({
        title: "Workspace switched",
        description: `Now viewing ${availableTenants.find((t) => t.id === tenantId)?.name ?? "workspace"}.`,
      });
    } else {
      toast({ title: "Switch failed", description: result.error, variant: "destructive" });
    }
  };

  return (
    <div className="px-4 pb-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1 mb-1.5">
        <Building2 className="w-3 h-3" /> Workspace
      </label>
      <Select value={session.tenantId} onValueChange={handleChange}>
        <SelectTrigger className="h-8 text-xs font-semibold">
          <SelectValue placeholder={tenant?.name ?? "Select workspace"} />
        </SelectTrigger>
        <SelectContent>
          {availableTenants.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
