import { api } from "@/lib/api";

// ─── Request / Response types ─────────────────────────────────────────────
export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: AuthUser;
  message?: string;
};

type MeResponse = {
  success: boolean;
  data: AuthUser;
};

// ─── Auth service ─────────────────────────────────────────────────────────
// Tokens are set as HTTP-only cookies by the backend.
// The frontend never reads or stores them manually.

export const authService = {
  /**
   * POST /api/auth/login
   * Backend sets accessToken + refreshToken as HTTP-only cookies.
   */
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
    return data;
  },

  /**
   * POST /api/auth/register
   * Creates a new account. Backend may also set cookies immediately.
   */
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      "/api/auth/register",
      payload
    );
    return data;
  },

  /**
   * GET /api/auth/me
   * Returns the authenticated user from the HTTP-only cookie session.
   * Throws if the cookie is missing / expired (401).
   */
  async me(): Promise<AuthUser> {
    const { data } = await api.get<MeResponse>("/api/auth/me");
    return data.data;
  },

  /**
   * POST /api/auth/logout
   * Instructs the backend to clear the HTTP-only cookies.
   */
  async logout(): Promise<void> {
    await api.post("/api/auth/logout");
  },
};
