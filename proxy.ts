import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // (onboarding) is a route group — parentheses are stripped from the URL.
  // Actual URLs: /signin, /signup, /forgot-password, /bvn-verification, /usecase-selection
  const isAuthPage =
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/bvn-verification") ||
    pathname.startsWith("/usecase-selection");

  // Pages that require authentication
  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/cards") ||
    pathname.startsWith("/payment-requests") ||
    pathname.startsWith("/calculator");

  // Not logged in → redirect to signin
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Logged in → block auth pages, send to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/settings/:path*",
    "/transactions/:path*",
    "/cards/:path*",
    "/payment-requests/:path*",
    "/calculator/:path*",
    "/signin",
    "/signup",
    "/forgot-password/:path*",
    "/bvn-verification/:path*",
    "/usecase-selection/:path*",
  ],
};
