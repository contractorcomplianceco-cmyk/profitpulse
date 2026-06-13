import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { integrations, integrationStats } from "@/data/integrationsData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Plug, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Integrations() {
  const { toast } = useToast();

  const handleConnect = (name: string, status: string) => {
    if (status === 'syncing') {
      toast({ title: "Already Syncing", description: `${name} is currently pulling data.` });
      return;
    }
    toast({
      title: status === 'connected' ? "Forcing Manual Sync" : "Initiating Connection",
      description: `Reaching out to ${name} API endpoints.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'connected': return <AlertBadge severity="info" />;
      case 'syncing': return <AlertBadge severity="warning" />;
      case 'disconnected': return <AlertBadge severity="critical" />;
      default: return null;
    }
  };

  // Group integrations by category
  const grouped = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) acc[integration.category] = [];
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, typeof integrations>);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Data Integrations" 
        description="Central nervous system connectivity. Manage API links to accounting, CRM, and marketing platforms."
        actions={<Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Sync All</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Total Connections" value={integrationStats.total} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Active / Syncing" value={integrationStats.connected} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Errors / Disconnected" value={integrationStats.error} inverseTrend />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="API Sync Reliability" description="Successful syncs vs errors over 7 days">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={integrationStats.syncTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorErr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="success" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorSuccess)" name="Success %" />
                  <Area type="monotone" dataKey="errors" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorErr)" name="Error Count" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Integration Health">
            LinkedIn Ads API token expired 3 days ago, halting ROI attribution for the ongoing B2B campaign. Re-authentication required by marketing admin.
          </InsightCard>
          
          <RiskWarning 
            title="Census Data Lag" 
            message="Macroeconomic census data failed to sync. Automated market forecasting models are currently relying on cached 30-day old data."
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="mt-8 space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-bold border-b border-border/50 pb-2">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <Card key={item.id} className="bg-card/50 backdrop-blur-xl border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center border border-border">
                          <Plug className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">{item.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">Last sync: {item.lastSync}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-between">
                      {getStatusBadge(item.status)}
                      <Button 
                        variant={item.status === 'disconnected' ? 'default' : 'secondary'} 
                        size="sm"
                        onClick={() => handleConnect(item.name, item.status)}
                        disabled={item.status === 'syncing'}
                      >
                        {item.status === 'disconnected' ? 'Reconnect' : item.status === 'syncing' ? 'Syncing...' : 'Force Sync'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
