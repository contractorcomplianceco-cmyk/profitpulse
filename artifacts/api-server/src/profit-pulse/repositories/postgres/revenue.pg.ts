/**
 * Future Postgres repository — stub only.
 * Implementation: Drizzle + pg pool + SET LOCAL app.tenant_id per transaction.
 */
import type { RevenueRepository } from "../interfaces";

export const postgresRevenueRepository: RevenueRepository = {
  async list() {
    throw new Error("Postgres revenue repository not implemented — use mock adapter.");
  },
  async getById() {
    throw new Error("Postgres revenue repository not implemented — use mock adapter.");
  },
  async create() {
    throw new Error("Postgres revenue repository not implemented — use mock adapter.");
  },
  async update() {
    throw new Error("Postgres revenue repository not implemented — use mock adapter.");
  },
  async delete() {
    throw new Error("Postgres revenue repository not implemented — use mock adapter.");
  },
};
