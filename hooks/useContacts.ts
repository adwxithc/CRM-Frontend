import { useState, useCallback } from "react";
import { DUMMY_CONTACTS } from "@/lib/data/contacts";
import type { Contact } from "@/lib/types";
import type { ContactFormValues } from "@/lib/validations/contact";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>(DUMMY_CONTACTS);

  const addContact = useCallback((values: ContactFormValues) => {
    const newContact: Contact = {
      id: `c-${Date.now()}`,
      name: values.name,
      email: values.email,
      phone: values.phone,
      company: values.company,
      status: values.status,
      notes: values.notes ?? "",
      location: "—",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setContacts((prev) => [newContact, ...prev]);
    return newContact;
  }, []);

  return { contacts, addContact };
}
