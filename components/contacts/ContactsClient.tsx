"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

import type { Contact, ContactStatus, Pagination } from "@/lib/types";
import type { ContactFormValues } from "@/lib/validations/contact";
import { contactService } from "@/lib/services/contact.service";
import { AddContactDialog } from "./AddContactDialog";

const PAGE_LIMIT = 10;

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<ContactStatus, { label: string; className: string }> =
  {
    Customer: {
      label: "Customer",
      className:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    },
    Prospect: {
      label: "Prospect",
      className:
        "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
    },
    Lead: {
      label: "Lead",
      className:
        "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    },
  };

function StatusBadge({ status }: Readonly<{ status: ContactStatus }>) {
  const s = STATUS_STYLES[status];
  return (
    <Badge
      variant="outline"
      className={`text-[11px] font-medium px-2 py-0.5 ${s.className}`}
    >
      {s.label}
    </Badge>
  );
}

// ─── Avatar initials ──────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Row actions ─────────────────────────────────────────────────────────────
function RowActions({
  contact,
  isDeleting,
  onEdit,
  onRequestDelete,
}: Readonly<{
  contact: Contact;
  isDeleting: boolean;
  onEdit: (contact: Contact) => void;
  onRequestDelete: (contact: Contact) => void;
}>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={`Actions for ${contact.name}`}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => onEdit(contact)}>
          Edit contact
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onRequestDelete(contact)}
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Delete confirmation dialog ───────────────────────────────────────────────
function DeleteConfirmDialog({
  contact,
  isDeleting,
  onConfirm,
  onCancel,
}: Readonly<{
  contact: Contact | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}>) {
  return (
    <AlertDialog open={!!contact}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete contact?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove{" "}
            <span className="font-medium text-foreground">
              {contact?.name}
            </span>{" "}
            from your contacts. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Search className="h-8 w-8 opacity-30" />
          <p className="text-sm font-medium">No contacts yet</p>
          <p className="text-xs">Add your first contact to get started.</p>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }: Readonly<{ message: string; onRetry: () => void }>) {
  return (
    <TableRow>
      <TableCell colSpan={6} className="py-20 text-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <AlertCircle className="h-8 w-8 text-destructive opacity-70" />
          <p className="text-sm font-medium text-destructive">{message}</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Pagination controls ──────────────────────────────────────────────────────
function PaginationControls({
  pagination,
  onPrev,
  onNext,
  onPage,
}: Readonly<{
  pagination: Pagination;
  onPrev: () => void;
  onNext: () => void;
  onPage: (p: number) => void;
}>) {
  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: (number | "\u2026")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("\u2026");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("\u2026");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {from}\u2013{to}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">{total}</span> contacts
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onPrev}
          disabled={!pagination.hasPrevPage}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p, i) =>
          p === "\u2026" ? (
            <span
              key={`ellipsis-before-${pages[i + 1] ?? "end"}`}
              className="px-1 text-muted-foreground text-sm select-none"
            >
              \u2026
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 text-xs"
              onClick={() => onPage(p)}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onNext}
          disabled={!pagination.hasNextPage}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────
export function ContactsClient() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchContacts = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.getContacts(p, PAGE_LIMIT);
      setContacts(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load contacts."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts(page);
  }, [page, fetchContacts]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAdd = async (values: ContactFormValues) => {
    const created = await contactService.createContact(values);
    toast.success("Contact added", {
      description: `${created.name} was added to your contacts.`,
    });
    // Go to page 1 or refresh current page
    if (page === 1) {
      fetchContacts(1);
    } else {
      setPage(1);
    }
  };

  const handleEdit = async (values: ContactFormValues) => {
    if (!editContact) return;
    const updated = await contactService.updateContact(editContact.id, values);
    toast.success("Contact updated", {
      description: `${updated.name} was updated successfully.`,
    });
    setEditContact(null);
    fetchContacts(page);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await contactService.deleteContact(deleteTarget.id);
      toast.success("Contact deleted", {
        description: `${deleteTarget.name} was removed.`,
      });
      setDeleteTarget(null);
      const newPage = contacts.length === 1 && page > 1 ? page - 1 : page;
      if (newPage === page) {
        fetchContacts(page);
      } else {
        setPage(newPage);
      }
    } catch (err) {
      toast.error("Delete failed", {
        description:
          err instanceof Error ? err.message : "Could not delete contact.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Delete confirmation ────────────────────────────────────── */}
      <DeleteConfirmDialog
        contact={deleteTarget}
        isDeleting={!!deletingId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ── Add Contact Dialog ─────────────────────────────────────── */}
      <AddContactDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
      />

      {/* ── Edit Contact Dialog ────────────────────────────────────── */}
      <AddContactDialog
        open={!!editContact}
        onOpenChange={(open) => !open && setEditContact(null)}
        onSubmit={handleEdit}
        defaultValues={
          editContact
            ? {
                name: editContact.name,
                email: editContact.email,
                phone: editContact.phone,
                company: editContact.company,
                status: editContact.status,
                notes: editContact.notes ?? "",
              }
            : undefined
        }
        title="Edit contact"
        submitLabel="Save changes"
      />

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pagination ? `${pagination.total} total contacts` : "Loading…"}
          </p>
        </div>
        <Button
          className="sm:ml-auto gap-2 w-full sm:w-auto"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* ── Table card ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-55 pl-4">Contact</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                if (loading) {
                  return (
                    <TableRow>
                      <TableCell colSpan={5} className="py-20 text-center">
                        <div className="flex justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
                if (error) {
                  return <ErrorState message={error} onRetry={() => fetchContacts(page)} />;
                }
                if (contacts.length === 0) {
                  return <EmptyState />;
                }
                return contacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className="border-border hover:bg-muted/30"
                  >
                    {/* Contact name + email */}
                    <TableCell className="pl-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate leading-none">
                            {contact.name}
                          </p>
                          <a
                            href={`mailto:${contact.email}`}
                            className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{contact.email}</span>
                          </a>
                        </div>
                      </div>
                    </TableCell>

                    {/* Company */}
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {contact.company}
                    </TableCell>

                    {/* Phone */}
                    <TableCell className="hidden lg:table-cell">
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="h-3 w-3 shrink-0" />
                        {contact.phone}
                      </a>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={contact.status} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      className="text-right pr-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <RowActions
                        contact={contact}
                        isDeleting={deletingId === contact.id}
                        onEdit={setEditContact}
                        onRequestDelete={setDeleteTarget}
                      />
                    </TableCell>
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && (
          <PaginationControls
            pagination={pagination}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
            onPage={setPage}
          />
        )}
      </div>
    </div>
  );
}

