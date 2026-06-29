import { newId } from "@/lib/profit-pulse/id";
import type { AuthRegistry, UserInvitation, UserRole } from "./types";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function createInvitation(
  registry: AuthRegistry,
  input: {
    tenantId: string;
    email: string;
    role: UserRole;
    invitedByUserId: string;
    invitedByEmail: string;
  },
): UserInvitation {
  const invite: UserInvitation = {
    id: newId("inv"),
    tenantId: input.tenantId,
    email: input.email.trim().toLowerCase(),
    role: input.role,
    status: "pending",
    invitedByUserId: input.invitedByUserId,
    invitedByEmail: input.invitedByEmail,
    token: newId("invtok"),
    expiresAt: new Date(Date.now() + INVITE_TTL_MS).toISOString(),
    createdAt: new Date().toISOString(),
  };
  registry.invitations.push(invite);
  return invite;
}

export function listInvitations(registry: AuthRegistry, tenantId: string): UserInvitation[] {
  return registry.invitations.filter((i) => i.tenantId === tenantId);
}

export function revokeInvitation(registry: AuthRegistry, tenantId: string, inviteId: string): boolean {
  const invite = registry.invitations.find((i) => i.id === inviteId && i.tenantId === tenantId);
  if (!invite || invite.status !== "pending") return false;
  invite.status = "revoked";
  return true;
}

/** Placeholder — accept invite on first login with matching email. */
export function acceptPendingInvitations(registry: AuthRegistry, email: string, userId: string): number {
  const normalized = email.trim().toLowerCase();
  let accepted = 0;
  const now = new Date().toISOString();

  for (const invite of registry.invitations) {
    if (invite.email !== normalized || invite.status !== "pending") continue;
    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      invite.status = "expired";
      continue;
    }
    const exists = registry.memberships.some(
      (m) => m.userId === userId && m.tenantId === invite.tenantId,
    );
    if (!exists) {
      registry.memberships.push({
        id: newId("mbr"),
        userId,
        tenantId: invite.tenantId,
        role: invite.role,
        createdAt: now,
      });
    }
    invite.status = "accepted";
    invite.acceptedAt = now;
    accepted++;
  }
  return accepted;
}
