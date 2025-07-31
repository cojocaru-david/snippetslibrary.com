import React, { memo, useCallback } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  MoreVertical,
  Globe,
  Lock,
  Calendar,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LazyCodeBlock } from "@/components/dashboard/LazyComponents";
import { formatDate, formatRelativeTime, truncateCode } from "@/lib/utils";
import type { SnippetCardProps } from "@/types";

export const SnippetCard = memo<SnippetCardProps>(function SnippetCard({
  snippet,
  onEdit,
  onDelete,
  onCopyShareUrl,
  onOpenShareUrl,
  onToggleBookmark,
  userSettings,
}) {
  const handleEdit = useCallback(() => onEdit(snippet), [onEdit, snippet]);
  const handleDelete = useCallback(
    () => onDelete(snippet.id),
    [onDelete, snippet.id],
  );
  const handleCopyShare = useCallback(() => {
    if (snippet.shareId) onCopyShareUrl(snippet.shareId);
  }, [onCopyShareUrl, snippet.shareId]);
  const handleOpenShare = useCallback(() => {
    if (snippet.shareId) onOpenShareUrl(snippet.shareId);
  }, [onOpenShareUrl, snippet.shareId]);

  const handleToggleBookmark = useCallback(() => {
    if (onToggleBookmark) {
      onToggleBookmark(snippet.id, snippet.isBookmarked || false);
    }
  }, [onToggleBookmark, snippet.id, snippet.isBookmarked]);

  return (
    <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border bg-card/50 backdrop-blur-sm flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate text-foreground group-hover:text-primary transition-colors">
              {snippet.title}
            </CardTitle>
            {snippet.description && (
              <CardDescription className="mt-2 text-sm line-clamp-2 text-muted-foreground">
                {snippet.description}
              </CardDescription>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark Button */}
            {onToggleBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleBookmark}
                className={`h-8 w-8 p-0 transition-all duration-200 hover:bg-accent ${
                  snippet.isBookmarked
                    ? "opacity-100 text-yellow-500 hover:text-yellow-600"
                    : "opacity-0 group-hover:opacity-100 hover:text-yellow-500"
                }`}
                title={
                  snippet.isBookmarked ? "Remove bookmark" : "Bookmark snippet"
                }
              >
                <Star
                  className={`h-4 w-4 ${snippet.isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-accent"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {snippet.isPublic && snippet.shareId && (
                  <>
                    <DropdownMenuItem onClick={handleCopyShare}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Share URL
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleOpenShare}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Share Link
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-xs font-medium px-2 py-1"
            >
              {snippet.language}
            </Badge>
            <div className="flex items-center gap-1">
              {snippet.isPublic ? (
                <Globe className="h-3 w-3 text-green-500" />
              ) : (
                <Lock className="h-3 w-3 text-amber-500" />
              )}
              <span className="text-xs text-muted-foreground font-medium">
                {snippet.isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>

          {snippet.isPublic && snippet.viewCount > 0 && (
            <div className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-1">
              <Eye className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">
                {snippet.viewCount}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col space-y-4">
        <div className="flex-1">
          <LazyCodeBlock
            code={truncateCode(snippet.code, { maxLines: 8 })}
            language={snippet.language}
            highlightTheme={userSettings?.codeBlockSettings?.theme}
            showExpandButton={false}
            showCopyButton={false}
            showDownloadButton={false}
          />
        </div>

        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {snippet.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={`${snippet.id}-${tag}-${index}`}
                variant="outline"
                className="text-xs font-medium px-2 py-1 hover:bg-accent transition-colors"
              >
                #{tag}
              </Badge>
            ))}
            {snippet.tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs font-medium px-2 py-1"
              >
                +{snippet.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(snippet.createdAt)}</span>
            </div>
            {snippet.updatedAt !== snippet.createdAt && (
              <span>Updated {formatRelativeTime(snippet.updatedAt)}</span>
            )}
          </div>

          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="w-full h-9 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Snippet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
