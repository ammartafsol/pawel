import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

const ACCESS_TOKEN_SECRET = `_Xpdx@345xsfefe!@#`;
const PROJECT_NAME = "proj";
const TOKEN_COOKIE_NAME = `_xpdx_${PROJECT_NAME}`;
const USER_METADATA_COOKIE_NAME = `_xpdx_m_${PROJECT_NAME}`;

// Decrypt function for middleware
const handleDecrypt = (encryptedMessage) => {
  if (!encryptedMessage) return null;
  try {
    const decrypted = CryptoJS.AES.decrypt(
      encryptedMessage,
      ACCESS_TOKEN_SECRET
    ).toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (error) {
    return null;
  }
};

// Get user role from cookie
const getUserRole = (cookies) => {
  const userMetadataCookie = cookies.get(USER_METADATA_COOKIE_NAME);
  if (!userMetadataCookie?.value) return null;

  try {
    const decrypted = handleDecrypt(userMetadataCookie.value);
    if (!decrypted) return null;
    const userMetadata = JSON.parse(decrypted);
    return userMetadata?.role?.toLowerCase() || null;
  } catch (error) {
    return null;
  }
};

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

  // Get user role (normalize to lowercase)
  const userRole = getUserRole(cookies);

  // Handle root path "/" - redirect to appropriate dashboard or login
  if (pathname === "/") {
    if (hasToken && userRole) {
      // User has token and role - redirect to their dashboard
      if (userRole === "staff") {
        return NextResponse.redirect(new URL("/staff", req.url));
      } else {
        // User, client, or any other non-staff role
        return NextResponse.redirect(new URL("/user", req.url));
      }
    } else {
      // No token or no role - redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  console.log("hasToken", tokenCookie);
  console.log("isPublicRoute", isPublicRoute);
  console.log("userRole", userRole);
  console.log("pathname", pathname);

  // If no token and trying to access protected route, redirect to login
  if (!hasToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If has token and trying to access auth routes, redirect based on role
  if (hasToken && isPublicRoute) {
    if (userRole === "staff") {
      return NextResponse.redirect(new URL("/staff", req.url));
    } else if (userRole && userRole !== "staff") {
      // User, client, or any other non-staff role
      return NextResponse.redirect(new URL("/user", req.url));
    }
  }

  // STRICT Role-based access control - enforce separation
  // This is the critical part that blocks cross-role access
  if (hasToken) {
    // Block staff from accessing user routes
    if (pathname.startsWith("/user")) {
      if (userRole === "staff") {
        return NextResponse.redirect(new URL("/staff", req.url));
      }
      // If we can't determine role, block access to role-specific routes for security
      if (!userRole) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Block users (non-staff) from accessing staff routes - THIS IS CRITICAL
    if (pathname.startsWith("/staff")) {
      // If role exists and is NOT staff, block access and redirect to user
      if (userRole && userRole !== "staff") {
        return NextResponse.redirect(new URL("/user", req.url));
      }
      // If role is unknown/null, block access to staff routes for security
      // Only allow if role is explicitly "staff"
      if (!userRole) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      // At this point, if we reach here and pathname starts with /staff,
      // userRole must be "staff", so allow access
    }

    // If has token but no role and trying to access protected route, redirect to login
    if (!userRole && !isPublicRoute) {
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
