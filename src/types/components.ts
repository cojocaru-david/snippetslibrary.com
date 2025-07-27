import { ReactNode } from "react";
import { z } from "zod";
import type { Snippet, PaginationInfo } from "./shared";

// Snippet Modal related types
export const snippetSchema = z.object({
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
    .max(50000, "Code must be less than 50,000 characters")
    .refine((val) => val.trim().length > 0, "Code cannot be empty"),
  language: z.string().min(1, "Language is required"),
  tags: z.string().max(500, "Tags must be less than 500 characters").optional(),
  isPublic: z.boolean(),
});

export type SnippetFormData = z.infer<typeof snippetSchema>;

export interface SnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  snippet?: Snippet;
  mode?: "create" | "edit" | "view";
}

// CodeBlock component types
export interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  code: string;
  language: string;
  highlightTheme?: string;
  title?: string;
  showCopyButton?: boolean;
  showDownloadButton?: boolean;
  showExpandButton?: boolean;
  rounded?: boolean;
  maxHeight?: string;
  hideScroll?: boolean;
  filename?: string;
}

// ShareDialog component types
export interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  snippet: {
    id: string;
    title: string;
    description?: string | null;
    shareId?: string | null;
    isPublic: boolean;
  };
  onGenerateShareLink: (snippetId: string) => Promise<string>;
}

// Auth component types
export interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Provider component types
export interface SessionProviderProps {
  children: ReactNode;
}

// Dashboard component types
export interface SnippetStatsProps {
  pagination: PaginationInfo;
  searchTerm?: string;
}

export interface SnippetGridProps {
  snippets: Snippet[];
  loading: boolean;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onCopyShareUrl: (shareId: string) => void;
  onOpenShareUrl: (shareId: string) => void;
  userSettings?: {
    codeBlockSettings?: {
      theme?: string;
    };
  };
}

export interface SnippetFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  selectedVisibility: string;
  setSelectedVisibility: (visibility: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  availableLanguages: string[];
  availableTags: string[];
  activeFiltersCount: number;
  onClearAllFilters: () => void;
}

export interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onCopyShareUrl: (shareId: string) => void;
  onOpenShareUrl: (shareId: string) => void;
  userSettings?: {
    codeBlockSettings?: {
      theme?: string;
    };
  };
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateSnippet: () => void;
  children?: React.ReactNode; // For filters component
}

export interface EmptyStateProps {
  hasActiveFilters: boolean;
  onCreateSnippet: () => void;
  onClearAllFilters: () => void;
}
