import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PreviewModuleBanner } from "@/components/profit-pulse/PreviewModuleBanner";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { reports, reportsChartData } from "@/data/reportsData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Download, FileSpreadsheet, FilePieChart, Presentation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Reports() {
  const { toast } = useToast();

  const handleExport = (name: string) => {
    toast({
      title: "Preview — export not available",
      description: `${name} is sample UI only. Use Integrations for CSV/JSON backup in this evaluation workspace.`,
    });
  };

  const getIcon = (cat: string) => {
    switch(cat) {
      case 'financial': return <FileSpreadsheet className="w-5 h-5 text-primary" />;
      case 'operational': return <FilePieChart className="w-5 h-5 text-warning" />;
      case 'strategic': return <Presentation className="w-5 h-5 text-success" />;
      default: return <FileSpreadsheet className="w-5 h-5" />;
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Reports Archive" 
        description="Preview report library — exports planned; use Integrations for CSV/JSON today."
        actions={<Button variant="outline">Schedule Report</Button>}
      />

      <PreviewModuleBanner />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Total Reports Generated" value={342} trend={[250, 280, 310, 342]} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Scheduled Deliveries" value={14} trend={[10, 12, 13, 14]} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Executive Views (30d)" value={89} trend={[65, 70, 75, 89]} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Report Utilization" description="Views and exports over the last 6 months">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} cursor={{fill: 'hsl(var(--muted)/0.2)'}} />
                  <Legend />
                  <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="exports" fill="hsl(var(--success))" name="Exports" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Reporting Insight">
            The "Client Profitability" report is consistently the least viewed among the executive team, despite margins dropping in 2 service lines. Recommend prioritizing this review in the next weekly sync.
          </InsightCard>
          
          <RiskWarning 
            title="Outdated Data Warning" 
            message="The Board/Investor Summary is pulling from data that is 14 days old. A fresh sync with Zoho Analytics is recommended before export."
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="mt-8">
        <h3 className="text-xl font-bold mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="bg-card/50 backdrop-blur-xl border-border/50 flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div className="p-2 bg-background rounded-md border border-border">
                  {getIcon(report.category)}
                </div>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-background/50">
                  {report.category}
                </Badge>
              </CardHeader>
              <CardContent className="pb-4 flex-1">
                <CardTitle className="text-base font-bold mb-2">{report.name}</CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {report.description}
                </p>
              </CardContent>
              <CardFooter className="pt-0 flex flex-col items-start gap-4">
                <div className="text-xs text-muted-foreground flex items-center gap-1 w-full">
                  <Clock className="w-3 h-3" />
                  Generated: {report.lastGenerated}
                </div>
                <Button variant="secondary" className="w-full justify-between group" onClick={() => handleExport(report.name)}>
                  Export
                  <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

const Clock = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)
