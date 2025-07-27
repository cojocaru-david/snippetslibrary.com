"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  Home,
  ArrowRight,
} from "lucide-react";
import PageIllustration from "@/components/landing/PageIllustration";
import Logo from "@/components/custom/logo";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams?.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration. Please contact support if this issue persists.";
      case "AccessDenied":
        return "Access was denied. You may not have permission to sign in with this account.";
      case "Verification":
        return "The verification link was invalid or has expired. Please try signing in again.";
      case "OAuthSignin":
        return "There was an error constructing the authorization URL. Please try again.";
      case "OAuthCallback":
        return "There was an error handling the response from GitHub. Please try signing in again.";
      case "OAuthCreateAccount":
        return "Could not create your account with GitHub. Please try again or contact support.";
      case "EmailCreateAccount":
        return "Could not create your email account. Please try again or contact support.";
      case "Callback":
        return "There was an error in the authentication callback. Please try signing in again.";
      case "OAuthAccountNotLinked":
        return "This email is already linked to another account. Please use a different sign-in method.";
      case "EmailSignin":
        return "Failed to send the verification email. Please check your email address and try again.";
      case "CredentialsSignin":
        return "The credentials you provided were invalid. Please check and try again.";
      case "SessionRequired":
        return "You must be signed in to access this page. Please sign in and try again.";
      default:
        return "An unexpected error occurred during authentication. Please try again or contact support if the issue persists.";
    }
  };

  const getErrorTitle = (error: string | null) => {
    switch (error) {
      case "AccessDenied":
        return "Access Denied";
      case "Configuration":
        return "Configuration Error";
      case "Verification":
        return "Verification Failed";
      case "OAuthAccountNotLinked":
        return "Account Already Linked";
      case "OAuthCallback":
      case "OAuthSignin":
        return "GitHub Authentication Error";
      default:
        return "Authentication Error";
    }
  };

  const isRetryable = (error: string | null) => {
    const retryableErrors = [
      "OAuthSignin",
      "OAuthCallback",
      "Verification",
      "EmailSignin",
      "CredentialsSignin",
      "Callback",
    ];
    return !error || retryableErrors.includes(error);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <PageIllustration />

      {/* Header with Logo */}
      <div className="relative z-20 px-4 sm:px-6 pt-8">
        <div className="flex justify-between items-center">
          <Logo />
          <button
            onClick={() => router.push("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6">
        <div className="w-full max-w-md mx-auto">
          {/* Error icon */}
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-destructive/10 p-6 border border-destructive/20">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
          </div>

          {/* Header section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 border-b pb-6 [border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1]">
              {getErrorTitle(error)}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {getErrorMessage(error)}
            </p>
          </div>

          {/* Error code display */}
          {error && (
            <div className="mb-8 bg-muted/50 border border-border px-4 py-3 rounded-lg text-center">
              <p className="text-xs text-muted-foreground font-mono">
                Error code: <span className="font-semibold">{error}</span>
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="relative before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1]">
            <div className="space-y-4 py-8">
              {isRetryable(error) && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => router.push("/auth/signin")}
                    className="group w-full h-12 bg-primary bg-gradient-to-t from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                    size="lg"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <RotateCcw className="w-5 h-5" />
                      Try signing in again
                      <span className="ml-1 tracking-normal text-primary-foreground/70 transition-transform group-hover:translate-x-0.5">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </span>
                  </Button>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="w-full h-12 bg-background hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                  size="lg"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Home className="w-5 h-5" />
                    Return to homepage
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Footer help text */}
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              Need help? Contact our support team if this error continues to
              occur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthErrorFallback() {
  return (
    <div className="relative min-h-screen bg-background">
      <PageIllustration />

      {/* Header with Logo */}
      <div className="relative z-20 px-4 sm:px-6 pt-8">
        <div className="flex justify-center">
          <Logo />
        </div>
      </div>

      {/* Loading content */}
      <div className="relative z-20 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6">
        <div className="w-full max-w-md mx-auto text-center">
          {/* Error icon */}
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-destructive/10 p-6 border border-destructive/20">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 border-b pb-6 [border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1]">
            Authentication Error
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Loading error details...
          </p>
          <div className="mt-8 space-y-4">
            <div className="animate-pulse bg-muted h-12 rounded-lg"></div>
            <div className="animate-pulse bg-muted h-12 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<AuthErrorFallback />}>
      <AuthErrorContent />
    </Suspense>
  );
}
