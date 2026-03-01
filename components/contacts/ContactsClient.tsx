"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Mail,
  Phone,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import { DUMMY_CONTACTS } from "@/lib/data/contacts";
import type { Contact, ContactStatus } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<
  ContactStatus,
  { label: string; className: string }
> = {
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

function StatusBadge({ status }: { status: ContactStatus }) {
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
function RowActions({ contact }: { contact: Contact }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={`Actions for ${contact.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem>View profile</DropdownMenuItem>
        <DropdownMenuItem>Edit contact</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <TableRow>
      <TableCell colSpan={6} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Search className="h-8 w-8 opacity-30" />
          <p className="text-sm font-medium">
            {query
              ? `No contacts found for "${query}"`
              : "No contacts yet"}
          </p>
          {query && (
            <p className="text-xs">
              Try a different name, email or company.
            </p>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Pagination controls ──────────────────────────────────────────────────────
function PaginationControls({
  page,
  totalPages,
  from,
  to,
  total,
  onPrev,
  onNext,
  onPage,
}: {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // build visible page numbers with ellipsis
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {from}–{to}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">{total}</span>{" "}
        contacts
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onPrev}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1 text-muted-foreground text-sm select-none"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 text-xs"
              onClick={() => onPage(p as number)}
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
          disabled={page === totalPages}
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
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Filtered dataset
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return DUMMY_CONTACTS;
    return DUMMY_CONTACTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
    );
  }, [query]);

  // Reset to page 1 when search changes
  const handleQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, filtered.length);
  const pageRows = filtered.slice(from - 1, to);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {DUMMY_CONTACTS.length} total contacts
          </p>
        </div>
        <Button
          className="sm:ml-auto gap-2 w-full sm:w-auto"
          onClick={() => router.push("/contacts/new")}
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* ── Table card ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name, email or company…"
              value={query}
              onChange={(e) => handleQuery(e.target.value)}
              className="h-9 pl-8 bg-muted/40 border-0 focus-visible:ring-1"
            />
          </div>
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground text-xs h-9"
              onClick={() => handleQuery("")}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[220px] pl-4">Contact</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead className="hidden sm:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <EmptyState query={query} />
              ) : (
                pageRows.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className="border-border hover:bg-muted/30 cursor-pointer"
                    onClick={() => router.push(`/contacts/${contact.id}`)}
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
                            onClick={(e) => e.stopPropagation()}
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
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="h-3 w-3 shrink-0" />
                        {contact.phone}
                      </a>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {contact.location}
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
                      <RowActions contact={contact} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <PaginationControls
          page={safePage}
          totalPages={totalPages}
          from={from}
          to={to}
          total={filtered.length}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          onPage={setPage}
        />
      </div>
    </div>
  );
}
