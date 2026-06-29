import { newId } from "@/lib/profit-pulse/id";
import type { AuditAction, AuditLogEntry } from "./types";

export const AUDIT_LOG_KEY = "profit-pulse-audit-v1";
const MAX_ENTRIES_PER_TENANT = 500;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

type AuditStore = Record<string, AuditLogEntry[]>;

function loadStore(): AuditStore {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    return raw ? (JSON.parse(raw) as AuditStore) : {};
  } catch {
    return {};
  }
}

function saveStore(store: AuditStore): void {
  if (!isBrowser()) return;
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(store));
}

export interface AuditInput {
  tenantId: string;
  userId: string;
  userEmail: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  summary: string;
  metadata?: Record<string, unknown>;
}

export function appendAuditLog(input: AuditInput): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: newId("aud"),
    tenantId: input.tenantId,
    userId: input.userId,
    userEmail: input.userEmail,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    summary: input.summary,
    at: new Date().toISOString(),
    metadata: input.metadata,
  };

  const store = loadStore();
  const list = store[input.tenantId] ?? [];
  const next = [entry, ...list].slice(0, MAX_ENTRIES_PER_TENANT);
  store[input.tenantId] = next;
  saveStore(store);
  return entry;
}

export function listAuditLogs(tenantId: string, limit = 100): AuditLogEntry[] {
  const store = loadStore();
  return (store[tenantId] ?? []).slice(0, limit);
}

export function clearAuditLogs(tenantId: string): void {
  const store = loadStore();
  delete store[tenantId];
  saveStore(store);
}
