import { useEffect } from "react";
import { useLocation } from "wouter";
import { isDemoMode } from "@/brand/demoMode";
import { useAuth } from "@/context/AuthProvider";
import { bypassesAuthGate, isAuthPublicRoute } from "@/routing/publicRoutes";

function hasSkipFlag(): boolean {
  if (typeof window === "undefined") return false;
  return /[?&#]skip(=1|=true)?(\b|&|$)/i.test(window.location.href);
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const [location, navigate] = useLocation();

  const isAuthPublic = isAuthPublicRoute(location);
  const bypass = bypassesAuthGate(location, isDemoMode) || (isDemoMode && hasSkipFlag());

  useEffect(() => {
    if (loading || bypass || isAuthPublic) return;
    if (!session) {
      navigate("/auth/login");
    }
  }, [loading, bypass, isAuthPublic, session, navigate]);

  if (loading && !isAuthPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        Loading session…
      </div>
    );
  }

  if (!bypass && !isAuthPublic && !session) return null;

  return <>{children}</>;
}
