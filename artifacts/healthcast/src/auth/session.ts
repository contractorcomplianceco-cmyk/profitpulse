import { newId } from "@/lib/profit-pulse/id";
import type { PersistedSession, SessionPayload, TenantMembership, User } from "./types";
import { ACCESS_TTL_MS, REFRESH_TTL_MS, REMEMBER_TTL_MS } from "./types";

const SESSION_KEY = "profit-pulse-session";

function b64Encode(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64Decode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return atob(padded + pad);
}

function signMock(payload: string): string {
  return b64Encode(`mock-sig:${payload.slice(0, 32)}`);
}

function buildToken(payload: SessionPayload): string {
  const header = b64Encode(JSON.stringify({ alg: "HS256-mock", typ: "JWT" }));
  const body = b64Encode(JSON.stringify(payload));
  return `${header}.${body}.${signMock(body)}`;
}

export function createSessionTokens(
  user: User,
  membership: TenantMembership,
  rememberMe = false,
): PersistedSession {
  const now = Date.now();
  const accessTtl = rememberMe ? REMEMBER_TTL_MS : ACCESS_TTL_MS;
  const accessPayload: SessionPayload = {
    sub: user.id,
    email: user.email,
    role: membership.role,
    tenantId: membership.tenantId,
    jti: newId("jti"),
    iat: now,
    exp: now + accessTtl,
  };
  const refreshPayload = {
    sub: user.id,
    type: "refresh" as const,
    jti: newId("rjti"),
    iat: now,
    exp: now + REFRESH_TTL_MS,
  };

  return {
    accessToken: buildToken(accessPayload),
    refreshToken: buildToken(refreshPayload as unknown as SessionPayload),
    accessExpiresAt: accessPayload.exp,
    refreshExpiresAt: refreshPayload.exp,
    rememberMe,
  };
}

export function parseSessionToken(token: string | null): SessionPayload | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(b64Decode(parts[1])) as SessionPayload & { type?: string };
    if (payload.type === "refresh") return null;
    if (!payload.sub || !payload.tenantId || !payload.email) return null;
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseRefreshToken(token: string): { sub: string; exp: number } | null {
  try {
    const parts = token.split(".");
    const payload = JSON.parse(b64Decode(parts[1])) as { sub?: string; type?: string; exp?: number };
    if (payload.type !== "refresh" || !payload.sub || !payload.exp) return null;
    if (Date.now() > payload.exp) return null;
    return { sub: payload.sub, exp: payload.exp };
  } catch {
    return null;
  }
}

export function loadPersistedSession(): PersistedSession | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedSession;
    if (!parsed.accessToken || !parsed.refreshToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePersistedSession(session: PersistedSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearPersistedSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getActiveSession(): SessionPayload | null {
  const persisted = loadPersistedSession();
  if (!persisted) return null;

  const access = parseSessionToken(persisted.accessToken);
  if (access) return access;

  const refresh = parseRefreshToken(persisted.refreshToken);
  if (!refresh) {
    clearPersistedSession();
    return null;
  }

  return null;
}

export function rotateAccessToken(
  persisted: PersistedSession,
  membership: TenantMembership,
  user: User,
): PersistedSession | null {
  const refresh = parseRefreshToken(persisted.refreshToken);
  if (!refresh || refresh.sub !== user.id) {
    clearPersistedSession();
    return null;
  }
  return createSessionTokens(user, membership, persisted.rememberMe);
}

/** @deprecated use loadPersistedSession */
export function loadSessionToken(): string | null {
  return loadPersistedSession()?.accessToken ?? null;
}

export function saveSessionFromPersisted(persisted: PersistedSession): void {
  savePersistedSession(persisted);
}

export function clearSessionToken(): void {
  clearPersistedSession();
}

export function createSessionToken(
  user: User,
  membership: TenantMembership,
  rememberMe = false,
): string {
  return createSessionTokens(user, membership, rememberMe).accessToken;
}
