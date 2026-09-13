import { getPublishedProductsLive, type Product } from "@/lib/products";
import { getRecentTelegramProductSlugs, persistTelegramPost } from "@/lib/supabase";
import { getTelegramConfig, isTelegramConfigured, sendTelegramProduct, telegramProductScore } from "@/lib/telegram";

export type TelegramPublishOptions = {
  force?: boolean;
  mass?: boolean;
  limit?: number;
  slug?: string;
  preferredSlugs?: string[];
  products?: Product[];
};

export type TelegramPublishItem = {
  ok: boolean;
  product: string;
  score: number;
  messageId?: number;
  reason?: string;
};

export async function publishTelegramProducts(options: TelegramPublishOptions = {}) {
  if (!isTelegramConfigured()) {
    return { ok: false as const, reason: "telegram-not-configured", sent: [], failed: [] };
  }

  const config = getTelegramConfig();
  const products = options.products?.length ? options.products : await getPublishedProductsLive();
  const productBySlug = new Map(products.map((product) => [product.slug, product]));
  const recent = options.force ? new Set<string>() : new Set(await getRecentTelegramProductSlugs(80));
  const preferred = new Set(options.preferredSlugs ?? []);
  const limit = options.mass
    ? Math.max(1, Math.min(options.limit ?? products.length, products.length))
    : Math.max(1, Math.min(options.limit ?? 1, products.length));

  const selected = selectProducts({
    products,
    productBySlug,
    recent,
    preferred,
    slug: options.slug,
    mass: options.mass,
    limit,
  });

  if (selected.length === 0 || !config.channelId) {
    return { ok: false as const, reason: options.slug ? "product-not-found" : "no-product", sent: [], failed: [] };
  }
  const channelId = config.channelId;

  const sent: TelegramPublishItem[] = [];
  const failed: TelegramPublishItem[] = [];

  for (const product of selected) {
    const item = await publishOneTelegramProduct(product);
    if (item.ok) sent.push(item);
    else failed.push(item);
    await sleep(1250);
  }

  return {
    ok: failed.length === 0,
    sent,
    failed,
    count: sent.length,
    failedCount: failed.length,
    product: sent[0]?.product ?? failed[0]?.product,
    messageId: sent[0]?.messageId,
    score: sent[0]?.score ?? failed[0]?.score,
    reason: failed.length > 0 ? `${failed.length} falha(s); ${sent.length} enviado(s)` : undefined,
  };

  async function publishOneTelegramProduct(product: Product): Promise<TelegramPublishItem> {
    const score = telegramProductScore(product);
    let result = await sendTelegramProductSafely(product);
    const retryAfter = retryAfterMs(result.error);
    if (!result.ok && retryAfter > 0) {
      await sleep(retryAfter + 700);
      result = await sendTelegramProductSafely(product);
    }
    await persistTelegramPost({
      productSlug: product.slug,
      channelId,
      status: result.ok ? "sent" : "failed",
      score,
      caption: result.caption,
      messageId: result.ok ? result.messageId : undefined,
      error: result.ok ? undefined : result.error,
    });

    return {
      ok: result.ok,
      product: product.slug,
      score,
      messageId: result.ok ? result.messageId : undefined,
      reason: result.ok ? undefined : result.error,
    };
  }
}

function selectProducts(input: {
  products: Product[];
  productBySlug: Map<string, Product>;
  recent: Set<string>;
  preferred: Set<string>;
  slug?: string;
  mass?: boolean;
  limit: number;
}) {
  if (input.slug) {
    const product = input.productBySlug.get(input.slug);
    return product ? [product] : [];
  }

  const ranked = input.products
    .filter((product) => product.image.startsWith("https://"))
    .filter((product) => !input.recent.has(product.slug))
    .sort((a, b) => {
      const preferredA = input.preferred.has(a.slug) ? 10_000 : 0;
      const preferredB = input.preferred.has(b.slug) ? 10_000 : 0;
      return preferredB + telegramProductScore(b) - (preferredA + telegramProductScore(a));
    });

  const fallback = input.products
    .filter((product) => product.image.startsWith("https://"))
    .sort((a, b) => telegramProductScore(b) - telegramProductScore(a));

  const pool = ranked.length > 0 ? ranked : fallback;
  return pool.slice(0, input.limit);
}

async function sendTelegramProductSafely(product: Product) {
  try {
    return await sendTelegramProduct(product);
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "telegram-send-failed",
      caption: undefined,
    };
  }
}

function retryAfterMs(error?: string) {
  const seconds = Number(error?.match(/retry after (\d+)/i)?.[1] ?? 0);
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 0;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
