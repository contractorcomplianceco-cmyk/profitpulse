import { Router, type IRouter } from "express";
import authRoutes from "./auth.routes";
import tenantsRoutes from "./tenants.routes";
import revenueRoutes from "./revenue.routes";
import expensesRoutes from "./expenses.routes";
import facilitiesRoutes from "./facilities.routes";
import opportunitiesRoutes from "./opportunities.routes";

/**
 * Profit Pulse API surface (mock-backed until Postgres is connected).
 *
 * Auth (no tenant header required for login):
 *   POST /api/profit-pulse/auth/login
 *   GET  /api/profit-pulse/auth/session   (requires X-Tenant-Id)
 *   POST /api/profit-pulse/auth/logout
 *
 * Tenant-scoped resources (mock headers: X-Tenant-Id, X-User-Role):
 *   GET/POST/PATCH/DELETE /api/profit-pulse/revenue
 *   GET/POST/PATCH/DELETE /api/profit-pulse/expenses
 *   GET/POST/PATCH/DELETE /api/profit-pulse/facilities
 *   GET/POST/PATCH/DELETE /api/profit-pulse/opportunities
 *   GET /api/profit-pulse/tenants/current
 */
const router: IRouter = Router();

router.use("/auth", authRoutes);
router.use("/tenants", tenantsRoutes);
router.use("/revenue", revenueRoutes);
router.use("/expenses", expensesRoutes);
router.use("/facilities", facilitiesRoutes);
router.use("/opportunities", opportunitiesRoutes);

export default router;
