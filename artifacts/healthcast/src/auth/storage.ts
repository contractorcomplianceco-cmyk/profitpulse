import { newId } from "@/lib/profit-pulse/id";
import type { AuthRegistry, Tenant, TenantMembership, User, UserRole } from "./types";
import {
  ACME_TENANT_ID,
  ACME_TENANT_NAME,
  DEFAULT_TENANT_ID,
  DEFAULT_TENANT_NAME,
} from "./types";

export const AUTH_REGISTRY_KEY = "profit-pulse-auth-v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function createDefaultRegistry(): AuthRegistry {
  const createdAt = new Date().toISOString();

  const demoTenant: Tenant = {
    id: DEFAULT_TENANT_ID,
    name: DEFAULT_TENANT_NAME,
    slug: "demo-company",
    createdAt,
  };

  const acmeTenant: Tenant = {
    id: ACME_TENANT_ID,
    name: ACME_TENANT_NAME,
    slug: "acme-healthcare",
    createdAt,
  };

  const users: User[] = [
    { id: "user-admin", email: "admin@demo.com", createdAt, lastTenantId: DEFAULT_TENANT_ID },
    { id: "user-manager", email: "manager@demo.com", createdAt, lastTenantId: DEFAULT_TENANT_ID },
    { id: "user-viewer", email: "viewer@demo.com", createdAt, lastTenantId: DEFAULT_TENANT_ID },
  ];

  const memberships: TenantMembership[] = [
    { id: "mbr-admin-demo", userId: "user-admin", tenantId: DEFAULT_TENANT_ID, role: "admin", createdAt },
    { id: "mbr-admin-acme", userId: "user-admin", tenantId: ACME_TENANT_ID, role: "admin", createdAt },
    { id: "mbr-mgr-demo", userId: "user-manager", tenantId: DEFAULT_TENANT_ID, role: "manager", createdAt },
    { id: "mbr-view-demo", userId: "user-viewer", tenantId: DEFAULT_TENANT_ID, role: "viewer", createdAt },
  ];

  return {
    version: 2,
    tenants: [demoTenant, acmeTenant],
    users,
    memberships,
    invitations: [],
  };
}

function migrateV1(parsed: Record<string, unknown>): AuthRegistry {
  const seed = createDefaultRegistry();
  const oldUsers = (parsed.users as Array<{ id: string; email: string; role: UserRole; tenantId: string }>) ?? [];
  for (const ou of oldUsers) {
    if (!seed.users.find((u) => u.email === ou.email)) {
      seed.users.push({ id: ou.id, email: ou.email, createdAt: new Date().toISOString(), lastTenantId: ou.tenantId });
    }
    if (!seed.memberships.find((m) => m.userId === ou.id && m.tenantId === ou.tenantId)) {
      seed.memberships.push({
        id: newId("mbr"),
        userId: ou.id,
        tenantId: ou.tenantId,
        role: ou.role,
        createdAt: new Date().toISOString(),
      });
    }
  }
  return seed;
}

export function loadAuthRegistry(): AuthRegistry {
  if (!isBrowser()) return createDefaultRegistry();
  try {
    const raw = localStorage.getItem(AUTH_REGISTRY_KEY);
    if (!raw) {
      const seed = createDefaultRegistry();
      saveAuthRegistry(seed);
      return seed;
    }
    const parsed = JSON.parse(raw) as AuthRegistry & { version?: number };
    if (parsed?.version === 2 && Array.isArray(parsed.memberships)) {
      if (!parsed.invitations) parsed.invitations = [];
      return parsed;
    }
    const migrated = migrateV1(parsed as unknown as Record<string, unknown>);
    saveAuthRegistry(migrated);
    return migrated;
  } catch {
    const seed = createDefaultRegistry();
    saveAuthRegistry(seed);
    return seed;
  }
}

export function saveAuthRegistry(registry: AuthRegistry): void {
  if (!isBrowser()) return;
  localStorage.setItem(AUTH_REGISTRY_KEY, JSON.stringify(registry));
}

export function findUserByEmail(registry: AuthRegistry, email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  return registry.users.find((u) => u.email.toLowerCase() === normalized);
}

export function findUserById(registry: AuthRegistry, id: string): User | undefined {
  return registry.users.find((u) => u.id === id);
}

export function findTenantById(registry: AuthRegistry, tenantId: string): Tenant | undefined {
  return registry.tenants.find((t) => t.id === tenantId);
}

export function getUserMemberships(registry: AuthRegistry, userId: string): TenantMembership[] {
  return registry.memberships.filter((m) => m.userId === userId);
}

export function getMembership(
  registry: AuthRegistry,
  userId: string,
  tenantId: string,
): TenantMembership | undefined {
  return registry.memberships.find((m) => m.userId === userId && m.tenantId === tenantId);
}

export function resolveOrCreateUser(registry: AuthRegistry, email: string): User {
  const existing = findUserByEmail(registry, email);
  if (existing) return existing;

  const demoTenant = findTenantById(registry, DEFAULT_TENANT_ID) ?? registry.tenants[0];
  const user: User = {
    id: newId("user"),
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
    lastTenantId: demoTenant?.id ?? DEFAULT_TENANT_ID,
  };
  registry.users.push(user);

  if (demoTenant) {
    registry.memberships.push({
      id: newId("mbr"),
      userId: user.id,
      tenantId: demoTenant.id,
      role: "viewer",
      createdAt: user.createdAt,
    });
  }

  saveAuthRegistry(registry);
  return user;
}

export function setUserLastTenant(registry: AuthRegistry, userId: string, tenantId: string): void {
  const user = findUserById(registry, userId);
  if (user) user.lastTenantId = tenantId;
}
