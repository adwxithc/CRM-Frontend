import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | CRM Platform",
  description: "Sign in to your CRM account",
};

export default function LoginPage() {
  return <LoginForm />;
}
