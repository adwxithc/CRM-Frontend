import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | CRM Platform",
  description: "Create your free CRM account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
