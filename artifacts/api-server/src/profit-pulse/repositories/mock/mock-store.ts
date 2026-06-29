import { randomUUID } from "node:crypto";
import type {
  ExpenseRecord,
  FacilityRecord,
  OpportunityRecord,
  RevenueRecord,
  TenantRecord,
  UserRecord,
} from "../interfaces";

/** In-memory mock store — mirrors localStorage SaaS mock; replaced by Postgres later. */
class MockDatabase {
  tenants = new Map<string, TenantRecord>();
  users = new Map<string, UserRecord>();
  revenue = new Map<string, RevenueRecord>();
  expenses = new Map<string, ExpenseRecord>();
  facilities = new Map<string, FacilityRecord>();
  opportunities = new Map<string, OpportunityRecord>();

  constructor() {
    this.seedDemo();
  }

  private seedDemo() {
    const tenantId = "tenant-demo-company";
    const tenant: TenantRecord = {
      id: tenantId,
      name: "Demo Company",
      slug: "demo-company",
      createdAt: new Date().toISOString(),
    };
    this.tenants.set(tenantId, tenant);

    const users: UserRecord[] = [
      { id: "user-admin", tenantId, email: "admin@demo.com", role: "admin", createdAt: tenant.createdAt },
      { id: "user-manager", tenantId, email: "manager@demo.com", role: "manager", createdAt: tenant.createdAt },
      { id: "user-viewer", tenantId, email: "viewer@demo.com", role: "viewer", createdAt: tenant.createdAt },
    ];
    for (const u of users) this.users.set(u.id, u);
  }
}

export const mockDb = new MockDatabase();

export function newId(): string {
  return randomUUID();
}

export function filterByTenant<T extends { tenantId: string }>(
  map: Map<string, T>,
  tenantId: string,
): T[] {
  return [...map.values()].filter((row) => row.tenantId === tenantId);
}

export function getByTenantAndId<T extends { tenantId: string }>(
  map: Map<string, T>,
  tenantId: string,
  id: string,
): T | null {
  const row = map.get(id) ?? null;
  if (!row || row.tenantId !== tenantId) return null;
  return row;
}
