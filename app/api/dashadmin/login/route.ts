import { cookies } from "next/headers";
import { adminCookieOptions, createAdminSessionToken, getAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const credentials = getAdminCredentials();

  if (username !== credentials.username || password !== credentials.password) {
    return Response.json({ ok: false, message: "Acesso negado." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("sp_admin_session", createAdminSessionToken(username), adminCookieOptions());
  return Response.json({ ok: true });
}
