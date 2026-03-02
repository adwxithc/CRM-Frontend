import { api } from "@/lib/api";
import type { Contact, ContactsResponse, Pagination } from "@/lib/types";
import type { ContactFormValues } from "@/lib/validations/contact";

// ─── Request / Response types ─────────────────────────────────────────────

export type GetContactsResult = {
  data: Contact[];
  pagination: Pagination;
};

type ContactMutationResponse = {
  success: true;
  data: Contact;
};

// ─── Service ──────────────────────────────────────────────────────────────

export const contactService = {
  /**
   * GET /api/contact/
   * Returns a paginated list of contacts.
   */
  async getContacts(page = 1, limit = 10): Promise<GetContactsResult> {
    const { data } = await api.get<ContactsResponse>("/api/contact/", {
      params: { page, limit },
    });
    return { data: data.data, pagination: data.pagination };
  },

  /**
   * POST /api/contact/
   * Creates a new contact.
   */
  async createContact(payload: ContactFormValues): Promise<Contact> {
    const { data } = await api.post<ContactMutationResponse>(
      "/api/contact/",
      payload
    );
    return data.data;
  },

  /**
   * PUT /api/contact/:id
   * Updates an existing contact by ID.
   */
  async updateContact(
    id: string,
    payload: Partial<ContactFormValues>
  ): Promise<Contact> {
    const { data } = await api.put<ContactMutationResponse>(
      `/api/contact/${id}`,
      payload
    );
    return data.data;
  },

  /**
   * DELETE /api/contact/:id
   * Deletes a contact by ID.
   */
  async deleteContact(id: string): Promise<void> {
    await api.delete(`/api/contact/${id}`);
  },
};
