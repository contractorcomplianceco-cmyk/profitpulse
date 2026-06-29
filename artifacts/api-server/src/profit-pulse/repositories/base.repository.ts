import type { TenantContext } from "../types";

/**
 * Base repository contract — every method requires explicit tenant scope.
 * Postgres implementation will also call app_set_tenant_id() per transaction.
 */
export interface TenantScopedRepository<T, CreateInput, UpdateInput = Partial<CreateInput>> {
  list(ctx: TenantContext): Promise<T[]>;
  getById(ctx: TenantContext, id: string): Promise<T | null>;
  create(ctx: TenantContext, input: CreateInput): Promise<T>;
  update(ctx: TenantContext, id: string, input: UpdateInput): Promise<T | null>;
  delete(ctx: TenantContext, id: string): Promise<boolean>;
}

export function assertTenantRow<T extends { tenantId: string }>(
  ctx: TenantContext,
  row: T,
): T {
  if (row.tenantId !== ctx.tenantId) {
    throw new Error("Tenant isolation violation: row does not belong to request tenant.");
  }
  return row;
}

export function tenantWhere(ctx: TenantContext) {
  return { tenantId: ctx.tenantId } as const;
}
