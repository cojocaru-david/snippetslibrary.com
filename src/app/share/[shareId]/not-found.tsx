import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-destructive/20 rounded-xl flex items-center justify-center mx-auto mb-6">
          <Code className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Snippet Not Found
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          The requested code snippet was not found or is no longer public.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Code className="w-4 h-4 mr-2" />
              Browse Snippets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
