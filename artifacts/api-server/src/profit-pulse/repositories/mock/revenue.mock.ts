import type { TenantContext } from "../../types";
import type { RevenueRepository, CreateRevenueInput } from "../interfaces";
import { filterByTenant, getByTenantAndId, mockDb, newId } from "./mock-store";

export const mockRevenueRepository: RevenueRepository = {
  async list(ctx: TenantContext) {
    return filterByTenant(mockDb.revenue, ctx.tenantId);
  },

  async getById(ctx, id) {
    return getByTenantAndId(mockDb.revenue, ctx.tenantId, id);
  },

  async create(ctx, input: CreateRevenueInput) {
    const row = { id: newId(), tenantId: ctx.tenantId, ...input };
    mockDb.revenue.set(row.id, row);
    return row;
  },

  async update(ctx, id, input) {
    const existing = getByTenantAndId(mockDb.revenue, ctx.tenantId, id);
    if (!existing) return null;
    const next = { ...existing, ...input };
    mockDb.revenue.set(id, next);
    return next;
  },

  async delete(ctx, id) {
    const existing = getByTenantAndId(mockDb.revenue, ctx.tenantId, id);
    if (!existing) return false;
    mockDb.revenue.delete(id);
    return true;
  },
};
