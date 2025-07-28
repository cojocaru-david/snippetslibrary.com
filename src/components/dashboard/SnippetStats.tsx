import React from "react";
import { Code, Search } from "lucide-react";
import type { SnippetStatsProps } from "@/types";

export function SnippetStats({ pagination, searchTerm }: SnippetStatsProps) {
  if (!pagination) {
    return null;
  }

  if (pagination.total === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Code className="h-4 w-4" />
          {pagination.total} snippet{pagination.total !== 1 ? "s" : ""} total
        </span>
        {searchTerm && (
          <span className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            Results for &quot;{searchTerm}&quot;
          </span>
        )}
      </div>
      {pagination.total > 0 && (
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
      )}
    </div>
  );
}
