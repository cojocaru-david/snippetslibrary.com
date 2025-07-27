import { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Globe,
  AlertCircle,
  Shield,
  Eye,
  Lock,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import toast from "react-hot-toast";

interface ShareDialogProps {
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

export function ShareDialog({
  isOpen,
  onClose,
  snippet,
  onGenerateShareLink,
}: ShareDialogProps) {
  const [shareId, setShareId] = useState<string | null>(
    snippet.shareId || null,
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const generateShareLink = async () => {
    if (shareId) return;

    setLoading(true);
    try {
      const newShareId = await onGenerateShareLink(snippet.id);
      setShareId(newShareId);
      toast.success("Share link generated successfully!");
    } catch (error) {
      console.error("Generate share link error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate share link";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareId) return;

    const shareUrl = `${window.location.origin}/share/${shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Copy error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to copy link",
      );
    }
  };

  const openInNewTab = () => {
    if (!shareId) return;

    const shareUrl = `${window.location.origin}/share/${shareId}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const revokeShareLink = async () => {
    if (!shareId) return;

    setIsRevoking(true);
    try {
      // Make the snippet private by setting isPublic to false
      const response = await fetch(`/api/snippets/${snippet.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublic: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to revoke share link");
      }

      setShareId(null);
      toast.success("Share link revoked successfully!");
    } catch (error) {
      console.error("Revoke error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to revoke share link",
      );
    } finally {
      setIsRevoking(false);
    }
  };

  const shareUrl = shareId ? `${window.location.origin}/share/${shareId}` : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[95vh] overflow-y-auto dialog-content">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Snippet
          </DialogTitle>
          <DialogDescription>
            Share{" "}
            <span className="font-semibold">&quot;{snippet.title}&quot;</span>{" "}
            with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Snippet Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="scroll-m-20 text-lg font-semibold tracking-tight break-words snippet-title">
                  {snippet.title}
                </h3>
                {snippet.description && (
                  <div className="mt-1 max-h-[100px] overflow-y-auto">
                    <p className="leading-7 text-muted-foreground text-sm line-clamp-3 break-words snippet-description">
                      {snippet.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {snippet.isPublic ? (
                  <Badge variant="secondary" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/30">
            <Shield className="h-5 w-5 mt-0.5 text-destructive" />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold">Security Notice</p>
              <p className="text-xs text-bg leading-relaxed">
                Share links provide public access to your snippet. Anyone with
                the link can view the content, even without an account. Only
                share with trusted recipients and consider the sensitivity of
                your code.
              </p>
            </div>
          </div>

          {shareId ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="share-url" className="text-sm font-medium">
                  Share URL
                </Label>
                <Badge variant="default" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    id="share-url"
                    value={shareUrl}
                    readOnly
                    className="font-mono text-sm share-url-input break-all"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 dialog-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openInNewTab}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={revokeShareLink}
                    disabled={isRevoking}
                    className="w-full text-destructive hover:text-destructive"
                  >
                    {isRevoking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Revoking...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border border-dashed border-bg bg-yellow-500/10 rounded-lg">
                <AlertCircle className="h-5 w-5 mt-0.5 text-yellow-500" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-semibold">No Share Link Created</p>
                  <p className="text-xs text-bg leading-relaxed">
                    Generate a secure public link to share this snippet. The
                    link will allow anyone to view your code without requiring
                    them to have an account.
                  </p>
                </div>
              </div>

              <Button
                onClick={generateShareLink}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Generating Link...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Generate Share Link
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
