"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authService, type AuthUser } from "@/lib/services/auth.service";

// ─── Context shape ────────────────────────────────────────────────────────
type AuthContextValue = {
  /** Authenticated user, or null when unauthenticated. */
  user: AuthUser | null;
  /** True once /me has resolved (success or failure). */
  loading: boolean;
  isAuthenticated: boolean;
  /** Call after a successful login / register to update state immediately. */
  setUser: (user: AuthUser | null) => void;
  /** Calls /api/auth/logout, clears state, redirects to /login. */
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: verify the HTTP-only cookie by calling /me
  useEffect(() => {
    let cancelled = false;
    authService
      .me()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore — clear state regardless
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      setUser,
      logout,
    }),
    [user, loading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
