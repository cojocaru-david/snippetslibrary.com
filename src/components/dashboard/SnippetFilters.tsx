import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SnippetFiltersProps {
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

export function SnippetFilters({
  showFilters,
  setShowFilters,
  selectedLanguage,
  setSelectedLanguage,
  selectedVisibility,
  setSelectedVisibility,
  selectedTags,
  setSelectedTags,
  availableLanguages,
  availableTags,
  activeFiltersCount,
  onClearAllFilters,
}: SnippetFiltersProps) {
  const handleTagSelect = (value: string) => {
    if (value && !selectedTags.includes(value)) {
      setSelectedTags([...selectedTags, value]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="relative">
      <Button
        variant={showFilters ? "default" : "outline"}
        onClick={() => setShowFilters(!showFilters)}
        className="h-12 px-4"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-2 h-5 min-w-5 text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full right-0 mt-2 w-[800px] max-w-[90vw] bg-card border border-border rounded-lg p-4 space-y-4 animate-in slide-in-from-top-2 duration-200 z-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Language Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Language</Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visibility Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Visibility
              </Label>
              <Select
                value={selectedVisibility}
                onValueChange={setSelectedVisibility}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Snippets</SelectItem>
                  <SelectItem value="true">Public Only</SelectItem>
                  <SelectItem value="false">Private Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Tags</Label>
              <div className="relative">
                <Select value="" onValueChange={handleTagSelect}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select tags..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags
                      .filter((tag) => !selectedTags.includes(tag))
                      .map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          #{tag}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Selected Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="flex items-center gap-1 pl-2 pr-1 py-1"
                  >
                    <span>#{tag}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag)}
                      className="h-4 w-4 p-0 hover:bg-primary-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Clear All Filters */}
          <div className="flex justify-end">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                onClick={onClearAllFilters}
                className="h-10"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
