import { NextRequest, NextResponse } from "next/server";

const PRIVATE_PATHS = ["/me"];
const AUTH_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("sessionToken")?.value;

  // Users who have not logged in cannot access private path
  if (
    PRIVATE_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    ) &&
    !sessionToken
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Users who have already logged in cannot access to '/login' or '/register' page
  if (
    AUTH_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    ) &&
    sessionToken
  ) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  return NextResponse.next();
}

// All routes that this middleware applies
export const config = {
  matcher: ["/login", "/register", "/me"],
};
