/**
 * Request-scoped tenant + user context.
 * Set by auth middleware before any repository call.
 */
export interface TenantContext {
  tenantId: string;
  userId: string;
  role: "admin" | "manager" | "viewer";
  email: string;
}

export interface ApiErrorBody {
  error: string;
  code?: string;
  details?: unknown;
}

export type UserRole = TenantContext["role"];
