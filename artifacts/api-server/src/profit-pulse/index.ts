/**
 * Repository adapter selection — swap mock → postgres without changing routes.
 */
import type {
  RevenueRepository,
  ExpensesRepository,
  FacilitiesRepository,
  OpportunitiesRepository,
} from "./repositories/interfaces";
import { mockRevenueRepository } from "./repositories/mock/revenue.mock";
import { mockExpensesRepository } from "./repositories/mock/expenses.mock";
import { mockFacilitiesRepository } from "./repositories/mock/facilities.mock";
import { mockOpportunitiesRepository } from "./repositories/mock/opportunities.mock";

export type DataAdapter = "mock" | "postgres";

const ADAPTER: DataAdapter = (process.env.PROFIT_PULSE_DATA_ADAPTER as DataAdapter) ?? "mock";

export function getRevenueRepository(): RevenueRepository {
  if (ADAPTER === "postgres") {
    throw new Error("Postgres adapter not enabled — set PROFIT_PULSE_DATA_ADAPTER=mock");
  }
  return mockRevenueRepository;
}

export function getExpensesRepository(): ExpensesRepository {
  return mockExpensesRepository;
}

export function getFacilitiesRepository(): FacilitiesRepository {
  return mockFacilitiesRepository;
}

export function getOpportunitiesRepository(): OpportunitiesRepository {
  return mockOpportunitiesRepository;
}

export { default as profitPulseRouter } from "./routes";
