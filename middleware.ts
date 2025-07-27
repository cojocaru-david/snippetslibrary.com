import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth(function middleware(req) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);

  if (session && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const publicRoutes = [
    "/",
    "/terms",
    "/not-found",
    "/sitemap.xml",
    "/robots.txt",
    "/api/auth",
    "/api/settings/public-seo",
    "/api/snippets/share",
  ];

  const staticPatterns = [
    "/_next",
    "/favicon",
    "/icons",
    "/manifest",
    "/robots.txt",
    "/sitemap.xml",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".css",
    ".js",
    ".json",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isStaticFile = staticPatterns.some((pattern) =>
    pathname.includes(pattern),
  );
  const isShareRoute = pathname.startsWith("/share/");

  if (isPublicRoute || isStaticFile || isShareRoute) {
    if (
      isStaticFile ||
      pathname === "/sitemap.xml" ||
      pathname === "/robots.txt"
    ) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=86400, s-maxage=86400",
      );
    } else if (isShareRoute) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=3600, s-maxage=7200",
      );
      response.headers.set("Vary", "User-Agent");
    }
    return response;
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/settings")) {
    if (!session) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!api/(?!auth|settings/public-seo|snippets/share)|_next/static|_next/image).*)",
  ],
};
