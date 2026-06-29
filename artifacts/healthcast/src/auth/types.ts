export type UserRole = "admin" | "manager" | "viewer";

export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

export type AuditAction =
  | "auth.login"
  | "auth.logout"
  | "auth.session_refresh"
  | "tenant.switch"
  | "invite.create"
  | "invite.revoke"
  | "entity.create"
  | "entity.update"
  | "entity.delete"
  | "data.import"
  | "data.export"
  | "data.reset";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

/** Global user identity (one email across tenants). */
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastTenantId?: string;
}

/** Role per tenant — enables tenant switching. */
export interface TenantMembership {
  id: string;
  userId: string;
  tenantId: string;
  role: UserRole;
  createdAt: string;
}

export interface UserInvitation {
  id: string;
  tenantId: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  invitedByUserId: string;
  invitedByEmail: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
}

export interface SessionPayload {
  sub: string;
  email: string;
  role: UserRole;
  tenantId: string;
  jti: string;
  iat: number;
  exp: number;
}

export interface PersistedSession {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
  rememberMe: boolean;
}

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  userId: string;
  userEmail: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  summary: string;
  at: string;
  metadata?: Record<string, unknown>;
}

export interface AuthRegistry {
  version: 2;
  tenants: Tenant[];
  users: User[];
  memberships: TenantMembership[];
  invitations: UserInvitation[];
}

export const DEFAULT_TENANT_NAME = "Demo Company";
export const DEFAULT_TENANT_ID = "tenant-demo-company";
export const ACME_TENANT_ID = "tenant-acme-healthcare";
export const ACME_TENANT_NAME = "Acme Healthcare";

export const ACCESS_TTL_MS = 24 * 60 * 60 * 1000;
export const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const REFRESH_TTL_MS = 90 * 24 * 60 * 60 * 1000;
