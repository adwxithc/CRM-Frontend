"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { contactSchema, type ContactFormValues } from "@/lib/validations/contact";

// ─── Types ────────────────────────────────────────────────────────────────────
type AddContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after validation passes — must return a promise */
  onSubmit: (values: ContactFormValues) => Promise<void>;
  /** Pre-populate fields for edit mode */
  defaultValues?: Partial<ContactFormValues>;
  title?: string;
  submitLabel?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function AddContactDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Add new contact",
  submitLabel = "Save contact",
}: Readonly<AddContactDialogProps>) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "Lead",
      notes: "",
      ...defaultValues,
    },
  });

  const { isSubmitting } = form.formState;
  const [apiError, setApiError] = useState<string | null>(null);

  // Reset (and re-populate) each time the dialog opens
  useEffect(() => {
    if (open) {
      setApiError(null);
      form.reset({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "Lead",
        notes: "",
        ...defaultValues,
      });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(values: ContactFormValues) {
    setApiError(null);
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg gap-0 p-0 overflow-hidden">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-0.5">
            Fill in the details below. Fields marked with{" "}
            <span className="text-destructive">*</span> are required.
          </DialogDescription>
        </DialogHeader>

        {/* ── Form ────────────────────────────────────────────────────── */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="px-6 py-5 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
              {/* API error banner */}
              {apiError && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{apiError}</span>
                </div>
              )}
              {/* Row: Name + Company */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jane Smith"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Company <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Acme Corp"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jane@acme.com"
                        autoComplete="off"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row: Phone + Status */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Status <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Lead">Lead</SelectItem>
                          <SelectItem value="Prospect">Prospect</SelectItem>
                          <SelectItem value="Customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any relevant notes about this contact…"
                        className="resize-none min-h-22.5"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ── Footer ────────────────────────────────────────────────── */}
            <DialogFooter className="px-6 py-4 border-t border-border gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
