import { useCallback, useState } from "react";
import { getUser, logout as clearSession, type AuthUser } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getUser());

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return {
    user,
    loading: false,
    isAuthenticated: Boolean(user),
    setUser,
    logout,
  };
}