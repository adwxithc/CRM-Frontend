import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be under 60 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^[+\d\s\(\)\-]+$/, "Invalid phone number format"),
  company: z
    .string()
    .min(1, "Company is required")
    .max(80, "Company name is too long"),
  status: z.enum(["Lead", "Prospect", "Customer"], {
    error: () => ({ message: "Please select a status" }),
  }),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
