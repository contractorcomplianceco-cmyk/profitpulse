import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/AppLayout";
import { BrandProvider } from "@/brand/BrandProvider";
import { GuidedTour } from "@/demo/GuidedTour";
import ExecutiveOverview from "@/pages/ExecutiveOverview";
import CashFlow from "@/pages/CashFlow";
import RevenueIntelligence from "@/pages/RevenueIntelligence";
import Profitability from "@/pages/Profitability";
import ArApCollections from "@/pages/ArApCollections";
import MarketingRoi from "@/pages/MarketingRoi";
import SalesPipeline from "@/pages/SalesPipeline";
import StaffingPayroll from "@/pages/StaffingPayroll";
import DepartmentPerformance from "@/pages/DepartmentPerformance";
import ClientProfitability from "@/pages/ClientProfitability";
import HistoricalTrends from "@/pages/HistoricalTrends";
import MarketEconomy from "@/pages/MarketEconomy";
import Futurecast from "@/pages/Futurecast";
import ScenarioBuilder from "@/pages/ScenarioBuilder";
import Alerts from "@/pages/Alerts";
import DailyBriefing from "@/pages/DailyBriefing";
import Reports from "@/pages/Reports";
import Integrations from "@/pages/Integrations";
import CfoCopilot from "@/pages/CfoCopilot";
import GoalsOkrs from "@/pages/GoalsOkrs";
import CashCalendar from "@/pages/CashCalendar";
import ComplianceRisk from "@/pages/ComplianceRisk";
import Welcome from "@/pages/Welcome";
import Landing from "@/pages/Landing";
import WhiteLabelSettings from "@/pages/WhiteLabelSettings";
import DemoWalkthrough from "@/demo/DemoWalkthrough";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/welcome" component={Welcome} />
        <Route path="/" component={ExecutiveOverview} />
        <Route path="/cash-flow" component={CashFlow} />
        <Route path="/revenue-intelligence" component={RevenueIntelligence} />
        <Route path="/profitability" component={Profitability} />
        <Route path="/ar-ap-collections" component={ArApCollections} />
        <Route path="/marketing-roi" component={MarketingRoi} />
        <Route path="/sales-pipeline" component={SalesPipeline} />
        <Route path="/staffing-payroll" component={StaffingPayroll} />
        <Route path="/department-performance" component={DepartmentPerformance} />
        <Route path="/client-profitability" component={ClientProfitability} />
        <Route path="/historical-trends" component={HistoricalTrends} />
        <Route path="/market-economy" component={MarketEconomy} />
        <Route path="/futurecast" component={Futurecast} />
        <Route path="/scenario-builder" component={ScenarioBuilder} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/daily-briefing" component={DailyBriefing} />
        <Route path="/reports" component={Reports} />
        <Route path="/integrations" component={Integrations} />
        <Route path="/copilot" component={CfoCopilot} />
        <Route path="/goals" component={GoalsOkrs} />
        <Route path="/cash-calendar" component={CashCalendar} />
        <Route path="/compliance" component={ComplianceRisk} />
        <Route path="/settings" component={WhiteLabelSettings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <BrandProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Switch>
              <Route path="/demo" component={DemoWalkthrough} />
              <Route path="/demo/" component={DemoWalkthrough} />
              <Route path="/landing" component={Landing} />
              <Route path="/landing/" component={Landing} />
              <Route component={Router} />
            </Switch>
          </WouterRouter>
          {/* Guided interactive product tour overlay (driven by ?tour=1 or demo mode) */}
          <GuidedTour />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </BrandProvider>
  );
}

export default App;
