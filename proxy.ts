import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminSessionToken } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/dashadmin/login";
  const isLoginApi = pathname === "/api/dashadmin/login";
  const isAdminAsset = pathname.startsWith("/dashadmin") || pathname.startsWith("/api/dashadmin");

  if (!isAdminAsset || isLogin || isLoginApi) return NextResponse.next();

  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (isValidAdminSessionToken(session)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return Response.json({ ok: false, message: "Acesso negado." }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/dashadmin/login", request.url));
}

export const config = {
  matcher: ["/dashadmin/:path*", "/api/dashadmin/:path*"],
};
