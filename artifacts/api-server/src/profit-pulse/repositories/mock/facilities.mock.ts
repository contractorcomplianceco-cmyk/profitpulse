import type { TenantContext } from "../../types";
import type { FacilitiesRepository, CreateFacilityInput } from "../interfaces";
import { filterByTenant, getByTenantAndId, mockDb, newId } from "./mock-store";

export const mockFacilitiesRepository: FacilitiesRepository = {
  async list(ctx: TenantContext) {
    return filterByTenant(mockDb.facilities, ctx.tenantId);
  },

  async getById(ctx, id) {
    return getByTenantAndId(mockDb.facilities, ctx.tenantId, id);
  },

  async create(ctx, input: CreateFacilityInput) {
    const row = { id: newId(), tenantId: ctx.tenantId, ...input };
    mockDb.facilities.set(row.id, row);
    return row;
  },

  async update(ctx, id, input) {
    const existing = getByTenantAndId(mockDb.facilities, ctx.tenantId, id);
    if (!existing) return null;
    const next = { ...existing, ...input };
    mockDb.facilities.set(id, next);
    return next;
  },

  async delete(ctx, id) {
    const existing = getByTenantAndId(mockDb.facilities, ctx.tenantId, id);
    if (!existing) return false;
    mockDb.facilities.delete(id);
    return true;
  },
};
