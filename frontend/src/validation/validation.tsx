import { z } from "zod";

export const requisitionItemSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),

  unit: z
    .string()
    .min(1, "Unit is required")
    .max(50, "Unit cannot exceed 50 characters"),

  estimated_rate: z
    .number()
    .positive("Estimated rate must be greater than 0"),
});

export const requisitionSchema = z.object({
  project_name: z
    .string()
    .min(1, "Project name is required")
    .max(200),

  department: z
    .string()
    .min(1, "Department is required")
    .max(100),

  items: z
    .array(requisitionItemSchema)
    .min(1, "Add at least one item"),
});

export type RequisitionFormData =
  z.infer<typeof requisitionSchema>;