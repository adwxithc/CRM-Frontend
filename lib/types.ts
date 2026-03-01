// ─── Contact ──────────────────────────────────────────────────────────────────
export type ContactStatus = "Lead" | "Prospect" | "Customer";

export type Contact = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: ContactStatus;
  location: string;
  createdAt: string; // ISO date string
};
