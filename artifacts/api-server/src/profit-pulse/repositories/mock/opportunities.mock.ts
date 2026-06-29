import type { TenantContext } from "../../types";
import type { OpportunitiesRepository, CreateOpportunityInput } from "../interfaces";
import { filterByTenant, getByTenantAndId, mockDb, newId } from "./mock-store";

export const mockOpportunitiesRepository: OpportunitiesRepository = {
  async list(ctx: TenantContext) {
    return filterByTenant(mockDb.opportunities, ctx.tenantId);
  },

  async getById(ctx, id) {
    return getByTenantAndId(mockDb.opportunities, ctx.tenantId, id);
  },

  async create(ctx, input: CreateOpportunityInput) {
    const row = { id: newId(), tenantId: ctx.tenantId, ...input };
    mockDb.opportunities.set(row.id, row);
    return row;
  },

  async update(ctx, id, input) {
    const existing = getByTenantAndId(mockDb.opportunities, ctx.tenantId, id);
    if (!existing) return null;
    const next = { ...existing, ...input };
    mockDb.opportunities.set(id, next);
    return next;
  },

  async delete(ctx, id) {
    const existing = getByTenantAndId(mockDb.opportunities, ctx.tenantId, id);
    if (!existing) return false;
    mockDb.opportunities.delete(id);
    return true;
  },
};
