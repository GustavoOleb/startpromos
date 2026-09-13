import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminSessionToken } from "@/lib/admin-auth";
import { createCardinalDrafts } from "@/lib/cardinal-agent";

function parseImportLines(raw: string) {
  return raw
    .split(/\r?\n/)
    .map((line: string) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const links = line.match(/https?:\/\/\S+/g) ?? [];
      const name = line.replace(/https?:\/\/\S+/g, "").trim();
      return links.map((link) => ({ link, name }));
    });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return Response.json({ ok: false, message: "Sessão inválida." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { raw?: unknown } | null;
  const raw = typeof body?.raw === "string" ? body.raw : "";
  const parsed = parseImportLines(raw);
  const links = parsed.map((item) => item.link);
  const names = parsed.map((item) => item.name);
  const result = await createCardinalDrafts({ links, names });

  return Response.json({ ok: true, ...result });
}
