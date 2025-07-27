"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import TextType from "@/components/ui/TextType";
import toast from "react-hot-toast";

// Dashboard Components
import {
  SnippetFilters,
  SnippetStats,
  SnippetGrid,
  EmptyState,
  SearchBar,
  LazyPagination,
} from "@/components/dashboard";
import type { Snippet, PaginationInfo } from "@/types";
import { SnippetModal } from "@/components/SnippetModal";

export default function DashboardPage() {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedVisibility, setSelectedVisibility] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | undefined>();
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const fetchingRef = useRef(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  const fetchSnippets = useCallback(async () => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
      if (selectedLanguage && selectedLanguage !== "all")
        params.set("language", selectedLanguage);
      if (selectedVisibility && selectedVisibility !== "all")
        params.set("isPublic", selectedVisibility);
      if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));

      const response = await fetch(`/api/snippets?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch snippets");
      }

      const data = await response.json();
      setSnippets(data.snippets);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching snippets:", error);
      toast.error("Failed to load snippets");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearchTerm,
    selectedLanguage,
    selectedVisibility,
    selectedTags,
  ]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearchTerm, selectedLanguage, selectedVisibility, selectedTags]);

  useEffect(() => {
    const handleCreateSnippet = () => {
      setSelectedSnippet(undefined);
      setModalMode("create");
      setModalOpen(true);
    };

    window.addEventListener("createSnippet", handleCreateSnippet);
    return () =>
      window.removeEventListener("createSnippet", handleCreateSnippet);
  }, []);

  const handleCreateSnippet = useCallback(() => {
    setSelectedSnippet(undefined);
    setModalMode("create");
    setModalOpen(true);
  }, []);

  const handleEditSnippet = useCallback((snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setModalMode("edit");
    setModalOpen(true);
  }, []);

  const handleDeleteSnippet = useCallback(
    async (snippetId: string) => {
      if (!confirm("Are you sure you want to delete this snippet?")) {
        return;
      }

      try {
        const response = await fetch(`/api/snippets/${snippetId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete snippet");
        }

        toast.success("Snippet deleted successfully");
        fetchSnippets();
        window.dispatchEvent(new CustomEvent("snippetUpdated"));
      } catch (error) {
        console.error("Error deleting snippet:", error);
        toast.error("Failed to delete snippet");
      }
    },
    [fetchSnippets],
  );

  const handleCopyShareUrl = useCallback(async (shareId: string) => {
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL");
    }
  }, []);

  const openShareUrl = useCallback((shareId: string) => {
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    window.open(shareUrl, "_blank");
  }, []);

  const getUniqueLanguages = useMemo(() => {
    const languages = snippets.map((s) => s.language);
    return [...new Set(languages)].sort();
  }, [snippets]);

  const getAllTags = useMemo(() => {
    const allTags = snippets.flatMap((s) => s.tags);
    return [...new Set(allTags)].sort();
  }, [snippets]);

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedLanguage("all");
    setSelectedVisibility("all");
    setSelectedTags([]);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      !!debouncedSearchTerm ||
      selectedLanguage !== "all" ||
      selectedVisibility !== "all" ||
      selectedTags.length > 0,
    [debouncedSearchTerm, selectedLanguage, selectedVisibility, selectedTags],
  );

  const activeFiltersCount = useMemo(
    () =>
      (selectedLanguage !== "all" ? 1 : 0) +
      (selectedVisibility !== "all" ? 1 : 0) +
      (selectedTags.length > 0 ? 1 : 0),
    [selectedLanguage, selectedVisibility, selectedTags],
  );

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <TextType
          className="text-3xl font-bold text-foreground mb-2"
          text={[
            "Welcome back, " + user?.name + "! 👋",
            "Ready to code something amazing?",
            "You have " + snippets.length + " snippets in your library.",
          ]}
          typingSpeed={100}
          pauseDuration={4000}
          showCursor={true}
          cursorCharacter="|"
        />
        <p className="text-muted-foreground">
          Manage your code snippets and build your personal library.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateSnippet={handleCreateSnippet}
        >
          <SnippetFilters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedVisibility={selectedVisibility}
            setSelectedVisibility={setSelectedVisibility}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            availableLanguages={getUniqueLanguages}
            availableTags={getAllTags}
            activeFiltersCount={activeFiltersCount}
            onClearAllFilters={clearAllFilters}
          />
        </SearchBar>

        <SnippetStats
          pagination={pagination}
          searchTerm={debouncedSearchTerm}
        />
      </div>

      {/* Snippets Grid */}
      {snippets.length === 0 ? (
        <EmptyState
          hasActiveFilters={hasActiveFilters}
          onCreateSnippet={handleCreateSnippet}
          onClearAllFilters={clearAllFilters}
        />
      ) : (
        <SnippetGrid
          snippets={snippets}
          loading={loading}
          onEdit={handleEditSnippet}
          onDelete={handleDeleteSnippet}
          onCopyShareUrl={handleCopyShareUrl}
          onOpenShareUrl={openShareUrl}
          userSettings={user?.settings}
        />
      )}

      {/* Pagination */}
      <LazyPagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        showInfo={true}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
        className="mt-12"
      />

      {/* Snippet Modal */}
      <SnippetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          fetchSnippets();
          window.dispatchEvent(new CustomEvent("snippetUpdated"));
        }}
        snippet={selectedSnippet}
        mode={modalMode}
      />
    </>
  );
}
