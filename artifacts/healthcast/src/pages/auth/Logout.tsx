import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthProvider";

export default function AuthLogout() {
  const { logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    logout();
    navigate("/auth/login");
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
      Signing out…
    </div>
  );
}
