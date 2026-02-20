import { NextResponse } from "next/server";

const PROJECT_NAME = "proj";
const TOKEN_COOKIE_NAME = `_xpdx_${PROJECT_NAME}`;

export default function middleware(req) {
  const { cookies, nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Get token cookie
  const tokenCookie = cookies.get(TOKEN_COOKIE_NAME);
  const hasToken = !!tokenCookie?.value;

  // Handle root path "/" - redirect to dashboard or login
  if (pathname === "/") {
    if (hasToken) {
      return NextResponse.redirect(new URL("/user", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // No token: redirect to auth page (/login)
  if (!hasToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If has token and trying to access auth routes, redirect to user dashboard
  if (hasToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/user", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|_next/|static/|public/|favicon.ico|images/|fonts/|svgs/|icon.png).*)",
  ],
};
