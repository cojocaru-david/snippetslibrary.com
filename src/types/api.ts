import { z } from "zod";

export const createSnippetSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .refine((val) => val.trim().length > 0, "Title cannot be empty"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  code: z
    .string()
    .min(1, "Code is required")
    .max(200000, "Code must be less than 200,000 characters")
    .refine((val) => val.trim().length > 0, "Code cannot be empty"),
  language: z.string().min(1, "Language is required"),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false),
});

export const updateSnippetSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .optional(),
  description: z.string().optional(),
  code: z.string().min(1, "Code is required").optional(),
  language: z.string().min(1, "Language is required").optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

export type CreateSnippetRequest = z.infer<typeof createSnippetSchema>;
export type UpdateSnippetRequest = z.infer<typeof updateSnippetSchema>;
