import { Router, type IRouter } from "express";
import { getTenantContext, authenticateMock } from "../middleware/tenant";
import { mockDb } from "../repositories/mock/mock-store";
import type { SessionResponse } from "../repositories/interfaces";

const router: IRouter = Router();

router.post("/login", (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  if (!email) {
    res.status(400).json({ error: "email required" });
    return;
  }

  const user = [...mockDb.users.values()].find((u) => u.email === email);
  const tenantId = user?.tenantId ?? "tenant-demo-company";
  const tenant = mockDb.tenants.get(tenantId) ?? null;

  const session: SessionResponse = {
    authenticated: true,
    tenant,
    user: user ?? {
      id: "mock-guest",
      tenantId,
      email,
      role: "viewer",
      createdAt: new Date().toISOString(),
    },
    permissions: {
      canWrite: user?.role !== "viewer",
      canAccessSettings: user?.role === "admin",
    },
  };

  res.json({
    token: `mock.${tenantId}.${user?.id ?? "guest"}`,
    session,
  });
});

router.get("/session", authenticateMock, (req, res) => {
  const ctx = getTenantContext(req);
  const user = [...mockDb.users.values()].find((u) => u.id === ctx.userId) ?? {
    id: ctx.userId,
    tenantId: ctx.tenantId,
    email: ctx.email,
    role: ctx.role,
    createdAt: new Date().toISOString(),
  };
  const tenant = mockDb.tenants.get(ctx.tenantId) ?? null;

  const body: SessionResponse = {
    authenticated: true,
    tenant,
    user,
    permissions: {
      canWrite: ctx.role !== "viewer",
      canAccessSettings: ctx.role === "admin",
    },
  };
  res.json(body);
});

router.post("/logout", authenticateMock, (_req, res) => {
  res.status(204).send();
});

export default router;
