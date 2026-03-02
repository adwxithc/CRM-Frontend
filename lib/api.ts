import axios, { AxiosError } from "axios";

// ─── Axios instance ────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  withCredentials: true, // send HTTP-only cookies on every request
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Response interceptor ──────────────────────────────────────────────────
// Normalises all error shapes to a plain Error so callers never deal with
// axios internals.
//
// Handled shapes (in priority order):
//   1. { errors: [{ message: "..." }, ...] }  ← backend validation format
//   2. { message: "..." }                      ← flat backend error
//   3. axios network / timeout message         ← fallback

type ApiErrorBody = {
  errors?: { message: string }[];
  message?: string;
};

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const body = error.response?.data;

    const message =
      body?.errors?.[0]?.message ??
      body?.message ??
      error.message ??
      "An unexpected error occurred";

    return Promise.reject(new Error(message));
  }
);
