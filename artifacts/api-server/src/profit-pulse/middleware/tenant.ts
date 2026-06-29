import type { Request, Response, NextFunction } from "express";
import type { TenantContext } from "../types";

declare global {
  namespace Express {
    interface Request {
      tenantContext?: TenantContext;
    }
  }
}

/** Mock auth: reads X-Tenant-Id / X-User-Id headers until real JWT is wired. */
export function authenticateMock(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const tenantId = req.header("x-tenant-id");
  const userId = req.header("x-user-id") ?? "mock-user";
  const role = (req.header("x-user-role") ?? "admin") as TenantContext["role"];
  const email = req.header("x-user-email") ?? "admin@demo.com";

  if (!tenantId) {
    res.status(401).json({ error: "Missing X-Tenant-Id header (mock auth)." });
    return;
  }

  req.tenantContext = { tenantId, userId, role, email };
  next();
}

export function requireWriteAccess(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const role = req.tenantContext?.role;
  if (!role || role === "viewer") {
    res.status(403).json({ error: "Read-only role cannot modify data." });
    return;
  }
  next();
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.tenantContext?.role !== "admin") {
    res.status(403).json({ error: "Admin role required." });
    return;
  }
  next();
}

export function getTenantContext(req: Request): TenantContext {
  if (!req.tenantContext) {
    throw new Error("Tenant context not set — authenticate middleware missing.");
  }
  return req.tenantContext;
}
