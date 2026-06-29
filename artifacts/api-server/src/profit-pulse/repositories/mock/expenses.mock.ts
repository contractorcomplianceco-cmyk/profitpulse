import type { TenantContext } from "../../types";
import type { ExpensesRepository, CreateExpenseInput } from "../interfaces";
import { filterByTenant, getByTenantAndId, mockDb, newId } from "./mock-store";

export const mockExpensesRepository: ExpensesRepository = {
  async list(ctx: TenantContext) {
    return filterByTenant(mockDb.expenses, ctx.tenantId);
  },

  async getById(ctx, id) {
    return getByTenantAndId(mockDb.expenses, ctx.tenantId, id);
  },

  async create(ctx, input: CreateExpenseInput) {
    const row = { id: newId(), tenantId: ctx.tenantId, ...input };
    mockDb.expenses.set(row.id, row);
    return row;
  },

  async update(ctx, id, input) {
    const existing = getByTenantAndId(mockDb.expenses, ctx.tenantId, id);
    if (!existing) return null;
    const next = { ...existing, ...input };
    mockDb.expenses.set(id, next);
    return next;
  },

  async delete(ctx, id) {
    const existing = getByTenantAndId(mockDb.expenses, ctx.tenantId, id);
    if (!existing) return false;
    mockDb.expenses.delete(id);
    return true;
  },
};
