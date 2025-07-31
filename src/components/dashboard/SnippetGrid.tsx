import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SnippetCard } from "./SnippetCard";
import type { SnippetGridProps } from "@/types";

function SkeletonCard() {
  return (
    <Card className="animate-pulse bg-card/50">
      <CardHeader className="pb-4">
        <div className="h-5 bg-muted/50 rounded-md mb-3"></div>
        <div className="h-4 bg-muted/30 rounded-md w-3/4 mb-3"></div>
        <div className="flex items-center gap-2">
          <div className="h-6 bg-muted/40 rounded-full w-16"></div>
          <div className="h-6 bg-muted/40 rounded-full w-20"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="h-24 bg-muted/30 rounded-lg"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted/40 rounded-full w-16"></div>
          <div className="h-6 bg-muted/40 rounded-full w-20"></div>
        </div>
        <div className="h-4 bg-muted/30 rounded-md w-1/2"></div>
      </CardContent>
    </Card>
  );
}

export function SnippetGrid({
  snippets,
  loading,
  onEdit,
  onDelete,
  onCopyShareUrl,
  onOpenShareUrl,
  onToggleBookmark,
  userSettings,
}: SnippetGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(12)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopyShareUrl={onCopyShareUrl}
          onOpenShareUrl={onOpenShareUrl}
          onToggleBookmark={onToggleBookmark}
          userSettings={userSettings}
        />
      ))}
    </div>
  );
}
