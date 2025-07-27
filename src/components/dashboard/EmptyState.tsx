import React from "react";
import { Code, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onCreateSnippet: () => void;
  onClearAllFilters: () => void;
}

export function EmptyState({
  hasActiveFilters,
  onCreateSnippet,
  onClearAllFilters,
}: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <Code className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-3">
        {hasActiveFilters ? "No snippets found" : "No snippets yet"}
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {hasActiveFilters
          ? "Try adjusting your filters or search terms to find what you're looking for."
          : "Start building your personal code library by creating your first snippet. Organize, share, and reuse your code effortlessly."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onCreateSnippet}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          {hasActiveFilters
            ? "Create New Snippet"
            : "Create Your First Snippet"}
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" size="lg" onClick={onClearAllFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
}
