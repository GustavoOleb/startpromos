import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminSessionToken } from "@/lib/admin-auth";
import { getPublishedProducts } from "@/lib/products";
import { upsertProductsToSupabase } from "@/lib/supabase";

export async function POST() {
  const cookieStore = await cookies();
  if (!isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return Response.json({ ok: false, message: "Sessão inválida." }, { status: 401 });
  }

  const result = await upsertProductsToSupabase(getPublishedProducts());
  return Response.json(result, { status: result.ok ? 200 : 502 });
}
