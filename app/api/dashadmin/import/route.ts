import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminSessionToken } from "@/lib/admin-auth";
import { createCardinalDrafts } from "@/lib/cardinal-agent";
import { publishTelegramProducts } from "@/lib/telegram-publisher";
import { draftToPublishedProduct } from "@/lib/supabase";
import type { ImportProductInput } from "@/lib/affiliate-import";

function cleanLink(link: string) {
  return link.replace(/[)\]}>,.;!?]+$/g, "");
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function parseImportLines(raw: string) {
  const matches = [...raw.matchAll(/https?:\/\/\S+/g)];
  if (matches.length === 0) return [];

  return matches.map((match, index) => {
    const link = cleanLink(match[0]);
    const start = match.index ?? 0;
    const previousEnd = index === 0 ? 0 : (matches[index - 1].index ?? 0) + matches[index - 1][0].length;
    const context = raw.slice(Math.max(previousEnd, start - 1800), start).trim();
    const inline = context.split(/\r?\n/).at(-1)?.replace(/https?:\/\/\S+/g, "").trim() ?? "";
    const seeded = parseSeedFromContext(context, link);
    return {
      link,
      name: seeded.name || inline,
      seed: seeded,
    };
  });
}

function parseSeedFromContext(context: string, link: string): Partial<ImportProductInput> {
  const productLine =
    context.match(/🛒\s*([\s\S]*?)(?:\n\s*🎁|\n\s*https?:\/\/|\n\s*\[\d{1,2}:\d{2}|$)/)?.[1] ??
    context.match(/(?:^|\n)\s*(?:Produto|Oferta):\s*([\s\S]*?)(?:\n|$)/i)?.[1];
  const priceMatch = context.match(/Preço\s*\[\s*R\$\s*([\d.]+,\d{2})\s*\]/i) ?? context.match(/R\$\s*([\d.]+,\d{2})/i);
  const discountMatch = context.match(/-(\d{1,2})%/);
  const soldMatch = context.match(/(\d{1,3}(?:\.\d{3})*|\d+)\+?\s*vendido/i);
  const name = cleanImportedName(productLine);
  const currentPrice = priceMatch ? Number(priceMatch[1].replace(/\./g, "").replace(",", ".")) : undefined;
  const previousPrice = currentPrice && discountMatch ? Number((currentPrice / (1 - Number(discountMatch[1]) / 100)).toFixed(2)) : undefined;

  return {
    name,
    currentPrice: Number.isFinite(currentPrice) ? currentPrice : undefined,
    previousPrice: Number.isFinite(previousPrice) ? previousPrice : undefined,
    reviewCount: soldMatch ? Number.parseInt(soldMatch[1].replace(/\./g, ""), 10) : undefined,
    affiliateUrl: link,
    originalUrl: link,
    source: link,
    tags: name ? name.split(/\s+/).slice(0, 8) : undefined,
  };
}

function cleanImportedName(value?: string) {
  return value
    ?.replace(/\s+/g, " ")
    .replace(/\s*🎁.*$/g, "")
    .trim()
    .slice(0, 500);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return Response.json({ ok: false, message: "Sessão inválida." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { raw?: unknown; publishTelegram?: unknown; telegramLimit?: unknown } | null;
  const raw = typeof body?.raw === "string" ? body.raw : "";
  const publishTelegram = body?.publishTelegram !== false;
  const telegramLimit = Number(body?.telegramLimit ?? 0);
  const parsed = parseImportLines(raw);
  const links = parsed.map((item) => item.link);
  const names = parsed.map((item) => item.name);
  const seeds = parsed.map((item) => item.seed);
  const result = await createCardinalDrafts({ links, names, seeds });
  const importedProducts = result.drafts
    .map(draftToPublishedProduct)
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
  const preferredSlugs = result.drafts
    .map((draft) => draft.slug || (draft.name ? slugify(draft.name) : undefined))
    .filter((value): value is string => Boolean(value));
  const telegram = publishTelegram
    ? await publishTelegramProducts({
        force: true,
        mass: true,
        limit: Number.isFinite(telegramLimit) && telegramLimit > 0 ? telegramLimit : undefined,
        preferredSlugs,
        products: importedProducts,
      })
    : { ok: true as const, skipped: true, reason: "disabled" };

  return Response.json({ ok: true, ...result, telegram });
}
