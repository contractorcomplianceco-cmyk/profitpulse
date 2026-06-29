import type { ProfitPulseState, CsvImportResult, RevenueRecord, ExpenseRecord } from "./types";
import { newId } from "./id";

export const CSV_SAMPLE = `date,type,category,description,amount,account
2025-05-01,revenue,Compliance Retainer,Monthly retainer,42000,Sunrise Senior Living
2025-05-03,expense,Payroll,Bi-weekly payroll,210000,
2025-05-05,revenue,Audit Services,Quarterly audit,15000,Heartland Health Group`;

const REQUIRED_COLUMNS = ["date", "type", "category", "description", "amount"] as const;

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function isValidDate(raw: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) && !Number.isNaN(Date.parse(`${raw}T12:00:00`));
}

export function parseCsvImport(
  csvText: string,
  state: ProfitPulseState,
): CsvImportResult {
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const result: CsvImportResult = { imported: 0, errors: [], revenueAdded: 0, expensesAdded: 0 };
  if (lines.length < 2) {
    result.errors.push({ row: 0, message: "CSV must include a header row and at least one data row." });
    return result;
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  for (const col of REQUIRED_COLUMNS) {
    if (!headers.includes(col)) {
      result.errors.push({ row: 1, message: `Missing required column: ${col}` });
      return result;
    }
  }

  const idx = (col: string) => headers.indexOf(col);

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const cols = parseCsvLine(lines[i]);
    if (cols.length < headers.length) {
      result.errors.push({ row: rowNum, message: "Row has fewer columns than header." });
      continue;
    }

    const date = cols[idx("date")];
    const type = cols[idx("type")]?.toLowerCase();
    const category = cols[idx("category")];
    const description = cols[idx("description")];
    const amountRaw = cols[idx("amount")];
    const accountName = headers.includes("account") ? cols[idx("account")] : "";

    if (!isValidDate(date)) {
      result.errors.push({ row: rowNum, message: `Invalid date "${date}" — use YYYY-MM-DD.` });
      continue;
    }
    if (!category || !description) {
      result.errors.push({ row: rowNum, message: "Category and description are required." });
      continue;
    }
    const amount = parseAmount(amountRaw);
    if (amount === null) {
      result.errors.push({ row: rowNum, message: `Invalid amount "${amountRaw}".` });
      continue;
    }
    if (type !== "revenue" && type !== "expense") {
      result.errors.push({ row: rowNum, message: `Type must be "revenue" or "expense", got "${type}".` });
      continue;
    }

    const account = accountName
      ? state.accounts.find((a) => a.name.toLowerCase() === accountName.toLowerCase())
      : undefined;

    if (type === "revenue") {
      const record: RevenueRecord = {
        id: newId("rev"),
        date,
        category,
        description,
        amount,
        accountId: account?.id ?? state.accounts[0]?.id ?? newId("acc"),
      };
      state.revenueRecords.push(record);
      result.revenueAdded++;
    } else {
      const record: ExpenseRecord = {
        id: newId("exp"),
        date,
        category,
        description,
        amount,
        vendor: accountName || "Imported",
        accountId: account?.id,
      };
      state.expenseRecords.push(record);
      result.expensesAdded++;
    }
    result.imported++;
  }

  return result;
}
