import dynamic from "next/dynamic";
import { Code, Share2 } from "lucide-react";

const CodeBlockLoading = () => (
  <div className="border rounded-lg bg-muted/10 animate-pulse">
    <div className="h-32 flex items-center justify-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Code className="w-4 h-4" />
        <span className="text-sm">Loading code preview...</span>
      </div>
    </div>
  </div>
);

const ShareDialogLoading = () => (
  <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Share2 className="w-6 h-6 animate-spin" />
      <span>Loading share options...</span>
    </div>
  </div>
);

export const LazyCodeBlock = dynamic(
  () =>
    import("@/components/CodeBlock").then((mod) => ({
      default: mod.CodeBlock,
    })),
  {
    loading: CodeBlockLoading,
    ssr: false,
  },
);

export const LazyShareDialog = dynamic(
  () =>
    import("@/components/ShareDialog").then((mod) => ({
      default: mod.ShareDialog,
    })),
  {
    loading: ShareDialogLoading,
    ssr: false,
  },
);

export const LazyCombobox = dynamic(
  () =>
    import("@/components/ui/combobox").then((mod) => ({
      default: mod.Combobox,
    })),
  {
    loading: () => (
      <div className="h-10 bg-muted/50 rounded-md animate-pulse flex items-center px-3">
        <span className="text-sm text-muted-foreground">
          Loading options...
        </span>
      </div>
    ),
    ssr: false,
  },
);

export const LazyPagination = dynamic(
  () =>
    import("@/components/ui/pagination").then((mod) => ({
      default: mod.Pagination,
    })),
  {
    loading: () => (
      <div className="flex justify-center py-4">
        <div className="h-10 w-64 bg-muted/50 rounded-md animate-pulse" />
      </div>
    ),
    ssr: false,
  },
);
