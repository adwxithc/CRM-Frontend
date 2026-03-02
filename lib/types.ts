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
  notes?: string;
};

// ─── Pagination ───────────────────────────────────────────────────────────────
export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ContactsResponse = {
  success: true;
  data: Contact[];
  pagination: Pagination;
};
