import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/AppLayout";
import { BrandProvider } from "@/brand/BrandProvider";
import { ProfitPulseProvider } from "@/context/ProfitPulseProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { BillingProvider } from "@/context/BillingProvider";
import { AuthGate } from "@/components/auth/AuthGate";
import { withFeatureGate } from "@/components/billing/withFeatureGate";
import { GuidedTour } from "@/demo/GuidedTour";
import { DemoFunnelProvider, useDemoFunnel } from "@/demo/DemoFunnel";
import { isDemoMode } from "@/brand/demoMode";
import { useEffect } from "react";
import { useLocation } from "wouter";
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
import FacilityIntelligence from "@/pages/FacilityIntelligence";
import Welcome from "@/pages/Welcome";
import Landing from "@/pages/Landing";
import WhiteLabelSettings from "@/pages/WhiteLabelSettings";
import TeamPage from "@/pages/Team";
import AuditLogPage from "@/pages/AuditLog";
import RequestDemo from "@/pages/RequestDemo";
import BuyNow from "@/pages/BuyNow";
import SignUp from "@/pages/SignUp";
import DemoWalkthrough from "@/demo/DemoWalkthrough";
import AuthLogin from "@/pages/auth/Login";
import AuthLogout from "@/pages/auth/Logout";
import AuthSession from "@/pages/auth/Session";
import BillingPage from "@/pages/Billing";
import {
  isPublicDemoRoute,
  PUBLIC_MARKETING_ROUTES,
} from "@/routing/publicRoutes";

const queryClient = new QueryClient();

const GatedExecutiveOverview = withFeatureGate("/", ExecutiveOverview);
const GatedCashFlow = withFeatureGate("/cash-flow", CashFlow);
const GatedRevenueIntelligence = withFeatureGate("/revenue-intelligence", RevenueIntelligence);
const GatedProfitability = withFeatureGate("/profitability", Profitability);
const GatedArAp = withFeatureGate("/ar-ap-collections", ArApCollections);
const GatedMarketingRoi = withFeatureGate("/marketing-roi", MarketingRoi);
const GatedSalesPipeline = withFeatureGate("/sales-pipeline", SalesPipeline);
const GatedStaffing = withFeatureGate("/staffing-payroll", StaffingPayroll);
const GatedDept = withFeatureGate("/department-performance", DepartmentPerformance);
const GatedClient = withFeatureGate("/client-profitability", ClientProfitability);
const GatedHistory = withFeatureGate("/historical-trends", HistoricalTrends);
const GatedMarket = withFeatureGate("/market-economy", MarketEconomy);
const GatedFuturecast = withFeatureGate("/futurecast", Futurecast);
const GatedScenario = withFeatureGate("/scenario-builder", ScenarioBuilder);
const GatedAlerts = withFeatureGate("/alerts", Alerts);
const GatedBriefing = withFeatureGate("/daily-briefing", DailyBriefing);
const GatedReports = withFeatureGate("/reports", Reports);
const GatedIntegrations = withFeatureGate("/integrations", Integrations);
const GatedCopilot = withFeatureGate("/copilot", CfoCopilot);
const GatedGoals = withFeatureGate("/goals", GoalsOkrs);
const GatedCashCalendar = withFeatureGate("/cash-calendar", CashCalendar);
const GatedCompliance = withFeatureGate("/compliance", ComplianceRisk);
const GatedFacility = withFeatureGate("/facility-intelligence", FacilityIntelligence);
const GatedSettings = withFeatureGate("/settings", WhiteLabelSettings);
const GatedTeam = withFeatureGate("/team", TeamPage);
const GatedAudit = withFeatureGate("/audit", AuditLogPage);

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/welcome" component={Welcome} />
        <Route path="/" component={GatedExecutiveOverview} />
        <Route path="/cash-flow" component={GatedCashFlow} />
        <Route path="/revenue-intelligence" component={GatedRevenueIntelligence} />
        <Route path="/profitability" component={GatedProfitability} />
        <Route path="/ar-ap-collections" component={GatedArAp} />
        <Route path="/marketing-roi" component={GatedMarketingRoi} />
        <Route path="/sales-pipeline" component={GatedSalesPipeline} />
        <Route path="/staffing-payroll" component={GatedStaffing} />
        <Route path="/department-performance" component={GatedDept} />
        <Route path="/client-profitability" component={GatedClient} />
        <Route path="/historical-trends" component={GatedHistory} />
        <Route path="/market-economy" component={GatedMarket} />
        <Route path="/futurecast" component={GatedFuturecast} />
        <Route path="/scenario-builder" component={GatedScenario} />
        <Route path="/alerts" component={GatedAlerts} />
        <Route path="/daily-briefing" component={GatedBriefing} />
        <Route path="/reports" component={GatedReports} />
        <Route path="/integrations" component={GatedIntegrations} />
        <Route path="/copilot" component={GatedCopilot} />
        <Route path="/goals" component={GatedGoals} />
        <Route path="/cash-calendar" component={GatedCashCalendar} />
        <Route path="/compliance" component={GatedCompliance} />
        <Route path="/facility-intelligence" component={GatedFacility} />
        <Route path="/settings" component={GatedSettings} />
        <Route path="/team" component={GatedTeam} />
        <Route path="/audit" component={GatedAudit} />
        <Route path="/billing" component={BillingPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

/**
 * Demo build only: enforce the sales funnel. If a prospect hasn't requested a
 * walkthrough yet, any attempt to reach the app is redirected to the marketing
 * landing page (where the "Start the demo" popup invites them to the lead form).
 * Once the lead is captured, the live guided sandbox is unlocked.
 */
// Internal bypass: open the app with `?skip=1` (or `#skip`) to go straight into
// the dashboard, skipping the prospect lead-gate. For the team/owner to review
// the portal. Prospects without the flag still get the full gated funnel.
function hasSkipFlag(): boolean {
  if (typeof window === "undefined") return false;
  const url = window.location.href;
  return /[?&#]skip(=1|=true)?(\b|&|$)/i.test(url) || window.location.hash.includes("skip");
}

function DemoGate({ children }: { children: React.ReactNode }) {
  const { unlocked, submitLead } = useDemoFunnel();
  const [location, navigate] = useLocation();

  // One-time: if the skip flag is present, unlock immediately.
  useEffect(() => {
    if (isDemoMode && hasSkipFlag() && !unlocked) {
      submitLead({ name: "Team Preview", email: "team@ccaprofitpulse.com", company: "CCA", phone: "" });
    }
  }, [unlocked, submitLead]);

  const isPublic =
    isPublicDemoRoute(location) ||
    (PUBLIC_MARKETING_ROUTES as readonly string[]).includes(location);
  const bypass = unlocked || hasSkipFlag();

  useEffect(() => {
    if (isDemoMode && !bypass && !isPublic) {
      navigate("/landing");
    }
  }, [bypass, isPublic, location, navigate]);

  if (isDemoMode && !bypass && !isPublic) return null;
  return <>{children}</>;
}

function MainAppShell() {
  return (
    <BillingProvider>
      <ProfitPulseProvider>
        <DemoFunnelProvider>
          <DemoGate>
            <Switch>
              <Route path="/auth/login" component={AuthLogin} />
              <Route path="/auth/logout" component={AuthLogout} />
              <Route path="/auth/session" component={AuthSession} />
              <Route path="/landing" component={Landing} />
              <Route path="/landing/" component={Landing} />
              <Route path="/request-demo" component={RequestDemo} />
              <Route path="/buy" component={BuyNow} />
              <Route path="/signup" component={SignUp} />
              <Route>
                <AuthGate>
                  <Router />
                </AuthGate>
              </Route>
            </Switch>
          </DemoGate>
          <GuidedTour />
        </DemoFunnelProvider>
      </ProfitPulseProvider>
    </BillingProvider>
  );
}

function App() {
  return (
    <BrandProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter hook={useHashLocation}>
              <Switch>
                {/* Public Rose demo — no login, no workspace providers, sample scenes only */}
                <Route path="/demo" component={DemoWalkthrough} />
                <Route path="/demo/" component={DemoWalkthrough} />
                <Route component={MainAppShell} />
              </Switch>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrandProvider>
  );
}

export default App;
