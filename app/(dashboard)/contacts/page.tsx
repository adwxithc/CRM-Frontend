import type { Metadata } from "next";
import { ContactsClient } from "@/components/contacts/ContactsClient";

export const metadata: Metadata = {
  title: "Contacts | CRM Platform",
  description: "Manage your contacts, leads and customers.",
};

export default function ContactsPage() {
  return <ContactsClient />;
}
