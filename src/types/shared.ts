export interface SharedSnippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  isPublic: boolean;
  shareId: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  displayTheme?: string;
  likesCount?: number;
  isLiked?: boolean;
  likesEnabled?: boolean;
}

export interface SEOSettings {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface ShareSnippetClientProps {
  snippet: SharedSnippet;
  seoSettings: SEOSettings | null;
  ownerHighlightTheme?: string;
}

export interface PageProps {
  params: Promise<{
    shareId: string;
  }>;
}

// Common snippet and pagination types
export interface Snippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  isPublic: boolean;
  shareId?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
  likesCount?: number;
  isLiked?: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
