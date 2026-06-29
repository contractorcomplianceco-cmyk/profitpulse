import type { SessionPayload, UserRole } from "./types";

export function canWrite(role: UserRole | undefined): boolean {
  return role === "admin" || role === "manager";
}

export function canAccessSettings(role: UserRole | undefined): boolean {
  return role === "admin";
}

export function isViewer(role: UserRole | undefined): boolean {
  return role === "viewer";
}

export function roleLabel(role: UserRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function permissionsFromSession(session: SessionPayload | null) {
  const role = session?.role;
  return {
    role,
    canWrite: canWrite(role),
    canAccessSettings: canAccessSettings(role),
    isViewer: isViewer(role),
  };
}
