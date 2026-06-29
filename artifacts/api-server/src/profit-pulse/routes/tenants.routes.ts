import { Router, type IRouter } from "express";
import { authenticateMock, getTenantContext } from "../middleware/tenant";
import { mockDb } from "../repositories/mock/mock-store";

const router: IRouter = Router();

router.use(authenticateMock);

router.get("/current", (req, res) => {
  const ctx = getTenantContext(req);
  const tenant = mockDb.tenants.get(ctx.tenantId);
  if (!tenant) {
    res.status(404).json({ error: "Tenant not found" });
    return;
  }
  res.json(tenant);
});

export default router;
