"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Github } from "lucide-react";
import { useState } from "react";
import PageIllustration from "@/components/landing/PageIllustration";
import Logo from "@/components/custom/logo";
import { useAuth } from "@/contexts/AuthContext";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const rawCallbackUrl = searchParams?.get("callbackUrl");
  const callbackUrl = (() => {
    if (!rawCallbackUrl) return "/dashboard";
    try {
      const decoded = decodeURIComponent(rawCallbackUrl);
      if (
        decoded.startsWith("http://localhost") ||
        decoded.startsWith("https://")
      ) {
        const url = new URL(decoded);
        return url.pathname + url.search;
      }
      return decoded.startsWith("/") ? decoded : "/dashboard";
    } catch {
      return "/dashboard";
    }
  })();

  const error = searchParams?.get("error");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, isLoading, callbackUrl, router]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("github", { callbackUrl });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <PageIllustration />

      <div className="relative z-10 px-4 sm:px-6 pt-8">
        <div className="flex justify-between items-center">
          <Logo />
          <button
            onClick={() => router.push("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
          </button>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 border-b pb-6 [border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1]">
              Welcome back
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Sign in to access your code snippets and continue building amazing
              things.
            </p>
          </div>

          {error && (
            <div className="mb-8 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm text-center">
              {error === "OAuthCallback" &&
                "There was an error with the OAuth provider."}
              {error === "AccessDenied" &&
                "Access was denied. Please try again."}
              {error === "Verification" &&
                "The verification link was invalid or has expired."}
              {!["OAuthCallback", "AccessDenied", "Verification"].includes(
                error,
              ) && `An error occurred during sign in: ${error}`}
            </div>
          )}

          <div className="relative before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1]">
            <div className="space-y-4 py-8">
              <div className="flex justify-center">
                <Button
                  onClick={handleSignIn}
                  disabled={loading || isLoading}
                  className="group w-full h-12 bg-primary bg-gradient-to-t from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Github className="w-5 h-5" />
                    {loading || isLoading
                      ? "Signing in..."
                      : "Continue with GitHub"}
                    {!loading && !isLoading && (
                      <span className="ml-1 tracking-normal text-primary-foreground/70 transition-transform group-hover:translate-x-0.5">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our terms of service and privacy
              policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInFallback() {
  return (
    <div className="relative min-h-screen bg-background">
      <PageIllustration />

      <div className="relative z-10 px-4 sm:px-6 pt-8">
        <div className="flex justify-center">
          <Logo />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6">
        <div className="w-full max-w-md mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 border-b pb-6 [border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1]">
            Welcome back
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Loading sign in options...
          </p>
          <div className="mt-8">
            <div className="animate-pulse bg-muted h-12 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPageClient() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInContent />
    </Suspense>
  );
}
