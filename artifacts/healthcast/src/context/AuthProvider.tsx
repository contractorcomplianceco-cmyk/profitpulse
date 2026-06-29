import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { appendAuditLog } from "@/auth/audit";
import {
  acceptPendingInvitations,
  createInvitation,
  listInvitations,
  revokeInvitation,
} from "@/auth/invitations";
import { permissionsFromSession } from "@/auth/permissions";
import {
  clearPersistedSession,
  createSessionTokens,
  getActiveSession,
  loadPersistedSession,
  parseSessionToken,
  rotateAccessToken,
  savePersistedSession,
} from "@/auth/session";
import {
  findTenantById,
  findUserByEmail,
  findUserById,
  getMembership,
  getUserMemberships,
  loadAuthRegistry,
  resolveOrCreateUser,
  saveAuthRegistry,
  setUserLastTenant,
} from "@/auth/storage";
import type {
  SessionPayload,
  Tenant,
  TenantMembership,
  User,
  UserInvitation,
  UserRole,
} from "@/auth/types";
import { DEFAULT_TENANT_ID } from "@/auth/types";

interface AuthContextValue {
  session: SessionPayload | null;
  user: User | null;
  tenant: Tenant | null;
  membership: TenantMembership | null;
  memberships: TenantMembership[];
  availableTenants: Tenant[];
  invitations: UserInvitation[];
  loading: boolean;
  rememberMe: boolean;
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  refreshSession: () => void;
  switchTenant: (tenantId: string) => Promise<{ ok: boolean; error?: string }>;
  inviteUser: (email: string, role: UserRole) => Promise<{ ok: boolean; error?: string; invitation?: UserInvitation }>;
  revokeInvite: (inviteId: string) => boolean;
  canWrite: boolean;
  canAccessSettings: boolean;
  isViewer: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function resolveActiveMembership(
  registry: ReturnType<typeof loadAuthRegistry>,
  user: User,
  preferredTenantId?: string,
): TenantMembership | null {
  const userMemberships = getUserMemberships(registry, user.id);
  if (userMemberships.length === 0) return null;

  const tenantId =
    preferredTenantId ??
    user.lastTenantId ??
    userMemberships[0]?.tenantId ??
    DEFAULT_TENANT_ID;

  return getMembership(registry, user.id, tenantId) ?? userMemberships[0] ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [registry, setRegistry] = useState(() => loadAuthRegistry());
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(true);

  const hydrateSession = useCallback(() => {
    const reg = loadAuthRegistry();
    setRegistry(reg);

    let persisted = loadPersistedSession();
    let active = getActiveSession();

    if (!active && persisted) {
      const sub = parseRefreshSub(persisted.refreshToken);
      const refreshUser = sub ? findUserById(reg, sub) : undefined;
      if (refreshUser) {
        const membership = resolveActiveMembership(reg, refreshUser, refreshUser.lastTenantId);
        if (membership) {
          const rotated = rotateAccessToken(persisted, membership, refreshUser);
          if (rotated) {
            savePersistedSession(rotated);
            persisted = rotated;
            active = parseSessionToken(rotated.accessToken);
            appendAuditLog({
              tenantId: membership.tenantId,
              userId: refreshUser.id,
              userEmail: refreshUser.email,
              action: "auth.session_refresh",
              entityType: "session",
              summary: "Session refreshed from refresh token",
            });
          }
        }
      }
    }

    setRememberMe(persisted?.rememberMe ?? false);
    setSession(active);
    setLoading(false);
  }, []);

  useEffect(() => {
    hydrateSession();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "profit-pulse-session") hydrateSession();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [hydrateSession]);

  const user = useMemo(
    () => (session ? findUserById(registry, session.sub) ?? null : null),
    [registry, session],
  );

  const membership = useMemo(() => {
    if (!session) return null;
    return getMembership(registry, session.sub, session.tenantId) ?? null;
  }, [registry, session]);

  const tenant = useMemo(
    () => (session ? findTenantById(registry, session.tenantId) ?? null : null),
    [registry, session],
  );

  const memberships = useMemo(
    () => (user ? getUserMemberships(registry, user.id) : []),
    [registry, user],
  );

  const availableTenants = useMemo(
    () =>
      memberships
        .map((m) => findTenantById(registry, m.tenantId))
        .filter((t): t is Tenant => !!t),
    [memberships, registry],
  );

  const invitations = useMemo(
    () => (session ? listInvitations(registry, session.tenantId) : []),
    [registry, session],
  );

  const establishSession = useCallback(
    (reg: ReturnType<typeof loadAuthRegistry>, u: User, m: TenantMembership, remember: boolean) => {
      setUserLastTenant(reg, u.id, m.tenantId);
      saveAuthRegistry(reg);
      const tokens = createSessionTokens(u, m, remember);
      savePersistedSession(tokens);
      setRememberMe(remember);
      setRegistry({ ...reg });
      setSession(parseSessionToken(tokens.accessToken));
    },
    [],
  );

  const login = useCallback(async (email: string, _password?: string, remember = false) => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      return { ok: false, error: "Enter a valid email address." };
    }

    const reg = loadAuthRegistry();
    const resolved = resolveOrCreateUser(reg, trimmed);
    acceptPendingInvitations(reg, trimmed, resolved.id);

    const membership = resolveActiveMembership(reg, resolved);
    if (!membership) {
      return { ok: false, error: "No workspace access for this account." };
    }

    establishSession(reg, resolved, membership, remember);

    appendAuditLog({
      tenantId: membership.tenantId,
      userId: resolved.id,
      userEmail: resolved.email,
      action: "auth.login",
      entityType: "session",
      summary: `Signed in to ${findTenantById(reg, membership.tenantId)?.name ?? "workspace"}`,
      metadata: { rememberMe: remember },
    });

    return { ok: true };
  }, [establishSession]);

  const logout = useCallback(() => {
    if (session && user) {
      appendAuditLog({
        tenantId: session.tenantId,
        userId: session.sub,
        userEmail: session.email,
        action: "auth.logout",
        entityType: "session",
        summary: "Signed out",
      });
    }
    clearPersistedSession();
    setSession(null);
  }, [session, user]);

  const switchTenant = useCallback(
    async (tenantId: string) => {
      if (!user) return { ok: false, error: "Not signed in." };
      const reg = loadAuthRegistry();
      const nextMembership = getMembership(reg, user.id, tenantId);
      if (!nextMembership) {
        return { ok: false, error: "You do not have access to that workspace." };
      }

      const fromTenant = session?.tenantId;
      establishSession(reg, user, nextMembership, rememberMe);

      appendAuditLog({
        tenantId,
        userId: user.id,
        userEmail: user.email,
        action: "tenant.switch",
        entityType: "tenant",
        entityId: tenantId,
        summary: `Switched workspace to ${findTenantById(reg, tenantId)?.name ?? tenantId}`,
        metadata: { fromTenantId: fromTenant },
      });

      return { ok: true };
    },
    [user, session, rememberMe, establishSession],
  );

  const inviteUser = useCallback(
    async (email: string, role: UserRole) => {
      if (!session || !user || session.role !== "admin") {
        return { ok: false, error: "Admin role required to invite users." };
      }
      const trimmed = email.trim();
      if (!trimmed.includes("@")) {
        return { ok: false, error: "Enter a valid email." };
      }

      const reg = loadAuthRegistry();
      const invitation = createInvitation(reg, {
        tenantId: session.tenantId,
        email: trimmed,
        role,
        invitedByUserId: user.id,
        invitedByEmail: user.email,
      });
      saveAuthRegistry(reg);
      setRegistry({ ...reg });

      appendAuditLog({
        tenantId: session.tenantId,
        userId: user.id,
        userEmail: user.email,
        action: "invite.create",
        entityType: "invitation",
        entityId: invitation.id,
        summary: `Invited ${trimmed} as ${role}`,
      });

      return { ok: true, invitation };
    },
    [session, user],
  );

  const revokeInvite = useCallback(
    (inviteId: string) => {
      if (!session || !user || session.role !== "admin") return false;
      const reg = loadAuthRegistry();
      const ok = revokeInvitation(reg, session.tenantId, inviteId);
      if (ok) {
        saveAuthRegistry(reg);
        setRegistry({ ...reg });
        appendAuditLog({
          tenantId: session.tenantId,
          userId: user.id,
          userEmail: user.email,
          action: "invite.revoke",
          entityType: "invitation",
          entityId: inviteId,
          summary: "Revoked pending invitation",
        });
      }
      return ok;
    },
    [session, user],
  );

  const refreshSession = useCallback(() => hydrateSession(), [hydrateSession]);

  const perms = permissionsFromSession(session);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      tenant,
      membership,
      memberships,
      availableTenants,
      invitations,
      loading,
      rememberMe,
      login,
      logout,
      refreshSession,
      switchTenant,
      inviteUser,
      revokeInvite,
      ...perms,
    }),
    [
      session,
      user,
      tenant,
      membership,
      memberships,
      availableTenants,
      invitations,
      loading,
      rememberMe,
      login,
      logout,
      refreshSession,
      switchTenant,
      inviteUser,
      revokeInvite,
      perms,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function parseRefreshSub(refreshToken: string): string | undefined {
  try {
    const body = refreshToken.split(".")[1];
    const payload = JSON.parse(atob(body.replace(/-/g, "+").replace(/_/g, "/")));
    return payload.sub as string | undefined;
  } catch {
    return undefined;
  }
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
