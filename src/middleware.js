import { NextResponse } from "next/server";

export default function middleware(req) {
  const { cookies, nextUrl } = req;
  const publicRoutes = [

  ];
  return NextResponse.next();

  if (cookies.has(TOKEN_COOKIE_NAME)) {
    if (nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } else {
    if (nextUrl.pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to all pages except:
    // - API routes
    // - Static assets (_next/static, _next/image, static, images, fonts, svgs, etc.)
    // - Favicon and other public assets
    "/((?!api/|_next/|static/|public/|favicon.ico|images/|fonts/|svgs/|icon.png).*)",
  ],
};
