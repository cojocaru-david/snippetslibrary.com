"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { Home, Plus, User, Settings, LogOut, Menu, X } from "lucide-react";
import Logo from "../custom/logo";

export default function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [snippetsCount, setSnippetsCount] = useState(0);

  React.useEffect(() => {
    const fetchSnippetsCount = async () => {
      try {
        const response = await fetch("/api/snippets?limit=1&page=1");
        if (response.ok) {
          const data = await response.json();
          setSnippetsCount(data.pagination?.total || 0);
        }
      } catch {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch snippets count");
      }
    };

    fetchSnippetsCount();

    const handleSnippetChange = () => {
      fetchSnippetsCount();
    };

    window.addEventListener("snippetUpdated", handleSnippetChange);
    return () =>
      window.removeEventListener("snippetUpdated", handleSnippetChange);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleCreateSnippet = () => {
    window.dispatchEvent(new CustomEvent("createSnippet"));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => navigate("/dashboard")}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="default"
              size="sm"
              className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              onClick={handleCreateSnippet}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Snippet
            </Button>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user?.image || ""}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40">
                    {user?.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {snippetsCount} snippet{snippetsCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard/settings")}
                className="h-8 w-8 p-0 hover:bg-muted transition-colors"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-8 w-8 p-0 transition-transform hover:scale-110"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-card/95 backdrop-blur animate-in slide-in-from-top-2 duration-200">
            <div className="py-4 space-y-3">
              <div className="flex items-center space-x-3 px-2 py-2 rounded-lg mx-2 bg-muted/50">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40">
                      {user?.name ? (
                        user.name.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {snippetsCount} snippet{snippetsCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Home className="h-4 w-4 mr-3" />
                  Dashboard
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    handleCreateSnippet();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Plus className="h-4 w-4 mr-3" />
                  New Snippet
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/dashboard/settings");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Button>
              </div>

              <div className="pt-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
