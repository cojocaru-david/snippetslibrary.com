import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getAllLanguages } from "@/lib/shiki";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

export const truncateCode = (
  code: string,
  options: {
    maxChars?: number;
    maxLines?: number;
    keepIndentation?: boolean;
  } = {},
) => {
  const { maxChars = 500, maxLines = 10, keepIndentation = true } = options;

  let lines = code.split("\n");

  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    return lines.join("\n") + "\n...";
  }

  let result = "";
  let charCount = 0;

  for (const line of lines) {
    const lineLength = line.length;

    if (charCount + lineLength > maxChars) {
      result += line.substring(0, maxChars - charCount);
      result += "...";
      break;
    }

    result += (keepIndentation ? line : line.trim()) + "\n";
    charCount += lineLength;
  }

  return result.trimEnd();
};

export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return "Invalid date";
  }
};

export const formatRelativeTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(dateString);
  } catch {
    return "Unknown time";
  }
};

/**
 * Generate OG image URL with proper encoding
 */
export function generateOGImageUrl(params: {
  title?: string;
  description?: string;
  language?: string;
  theme?: "light" | "dark" | "system";
  author?: string;
  lines?: number;
  baseUrl?: string;
}): string {
  const {
    title = "Code Snippet",
    description = "A beautiful code snippet shared with you",
    language = "javascript",
    theme = "light",
    author,
    lines = 15,
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001",
  } = params;

  const searchParams = new URLSearchParams();

  // Add parameters with proper encoding
  searchParams.set("title", title.slice(0, 60));
  searchParams.set("description", description.slice(0, 120));
  searchParams.set("language", language.toLowerCase());
  searchParams.set("theme", theme);

  if (author && author.trim()) {
    searchParams.set("author", author.trim());
  }

  if (lines && lines > 0) {
    searchParams.set("lines", Math.min(lines, 20).toString());
  }

  return `${baseUrl}/api/og?${searchParams.toString()}`;
}

export function getFileExtension(language: string): string {
  const extensions = getAllLanguages();
  const extension = extensions.find(
    (ext) => ext.value.toLowerCase() === language.toLowerCase(),
  )?.value;

  return extension || "txt";
}
