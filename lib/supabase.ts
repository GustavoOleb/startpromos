import type { Category, Product } from "@/lib/products";
import type { ImportDraft } from "@/lib/affiliate-import";

type SupabaseConfig = {
  url?: string;
  serviceRoleKey?: string;
  anonKey?: string;
};

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function isSupabaseConfigured() {
  const config = getSupabaseConfig();
  return Boolean(config.url && (config.serviceRoleKey || config.anonKey));
}

export type SupabaseHealth = {
  configured: boolean;
  schemaReady: boolean;
  reason?: string;
};

export async function getSupabaseHealth(): Promise<SupabaseHealth> {
  if (!isSupabaseConfigured()) return { configured: false, schemaReady: false, reason: "sem credenciais" };

  try {
    const response = await supabaseRequest("cardinal_runs?select=id&limit=1", {
      method: "GET",
      headers: { Prefer: "" },
    });
    if (response.ok) return { configured: true, schemaReady: true };
    return { configured: true, schemaReady: false, reason: await response.text() };
  } catch (error) {
    return { configured: true, schemaReady: false, reason: error instanceof Error ? error.message : "falha desconhecida" };
  }
}

export function productToSupabaseRow(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory,
    brand: product.brand,
    price: product.price,
    old_price: product.oldPrice ?? null,
    rating: product.rating ?? null,
    rating_count: product.ratingCount ?? null,
    sales_count: product.salesCount ?? null,
    image_url: product.image,
    affiliate_url: product.affiliateUrl,
    palette: product.palette,
    offers: product.offers,
    price_history: product.priceHistory,
    found_minutes_ago: product.foundMinutesAgo,
    tags: product.tags,
    description: product.description,
    source: product.source ?? product.affiliateUrl,
    last_verified_at: product.lastVerifiedAt ?? new Date().toISOString(),
    network: product.network ?? null,
    status: product.status ?? "published",
  };
}

function inferCategory(input: string): Category {
  const text = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/(chinelo|tenis|sandalia|slide|babuche|calcado|sapato)/.test(text)) return "calcados";
  if (/(furadeira|parafusadeira|esmerilhadeira|panela|porta temperos|lencol|churrasqueira|casa|cozinha|carro|microfibra)/.test(text)) return "casa";
  if (/(relogio|fone|celular|gadget|tech|eletronico)/.test(text)) return "tech";
  if (/(creatina|suplemento|beleza|maquiagem|skincare|perfume)/.test(text)) return "beleza";
  return "roupas";
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

function networkLabel(network?: string) {
  if (network === "tiktok-shop") return "TikTok Shop";
  if (network === "shein") return "SHEIN";
  if (network === "shopee") return "Shopee";
  return "Marketplace";
}

const FALLBACK_PRODUCT_IMAGE = "https://placehold.co/900x900/111111/ff5a1f/png?text=StartPromos";

export function draftToPublishedProduct(draft: ImportDraft): Product | null {
  if (!draft.name || !draft.affiliateUrl) return null;
  const category = inferCategory(`${draft.name} ${draft.category ?? ""} ${draft.subcategory ?? ""}`);
  const price = draft.currentPrice && draft.currentPrice > 0 ? draft.currentPrice : 0;
  const store = networkLabel(draft.network);

  return {
    slug: draft.slug || slugify(draft.name),
    name: draft.name,
    category,
    subcategory: draft.subcategory || draft.category || (category === "roupas" ? "Achados" : "Ofertas"),
    brand: draft.brand || store,
    price,
    oldPrice: draft.previousPrice,
    rating: draft.rating,
    ratingCount: draft.reviewCount,
    image: draft.imageUrl || FALLBACK_PRODUCT_IMAGE,
    affiliateUrl: draft.affiliateUrl,
    palette: ["#111111", "#ff5a1f"],
    offers: [{ store, price, affiliateReady: true, isBest: true }],
    priceHistory: price > 0 ? [price] : [],
    foundMinutesAgo: 1,
    tags: draft.tags ?? [],
    description: draft.name,
    source: draft.source ?? draft.originalUrl ?? draft.affiliateUrl,
    lastVerifiedAt: draft.lastVerifiedAt ?? new Date().toISOString(),
    network: draft.network,
    status: "published",
  };
}

function draftToProductRow(draft: ImportDraft) {
  const product = draftToPublishedProduct(draft);
  return product ? productToSupabaseRow(product) : null;
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const config = getSupabaseConfig();
  const key = config.serviceRoleKey || config.anonKey;
  if (!config.url || !key) throw new Error("Supabase não configurado");

  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers,
    },
  });
}

export async function recordClickEvent(input: {
  productSlug: string;
  source?: string;
  userAgent?: string | null;
  referer?: string | null;
}) {
  if (!isSupabaseConfigured()) return { ok: false, skipped: true, reason: "supabase-not-configured" };

  try {
    const response = await supabaseRequest("click_events", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        product_slug: input.productSlug,
        source: input.source ?? "site",
        user_agent: input.userAgent ?? null,
        referer: input.referer ?? null,
      }),
    });
    if (!response.ok) return { ok: false, status: response.status, reason: await response.text() };
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "click-event-failed" };
  }
}

export async function persistCardinalRun(input: {
  checkedLinks: number;
  accepted: number;
  rejected: number;
  notes: string[];
  drafts: ImportDraft[];
}) {
  if (!isSupabaseConfigured()) return { ok: false, skipped: true, reason: "supabase-not-configured" };

  try {
    const runResponse = await supabaseRequest("cardinal_runs", {
      method: "POST",
      body: JSON.stringify({
        checked_links: input.checkedLinks,
        accepted: input.accepted,
        rejected: input.rejected,
        finished_at: new Date().toISOString(),
        notes: input.notes,
      }),
    });

    if (!runResponse.ok) return { ok: false, status: runResponse.status, reason: await runResponse.text() };
    const [run] = (await runResponse.json()) as Array<{ id: string }>;

    if (input.drafts.length > 0) {
      const autopublishRows = input.drafts.map(draftToProductRow).filter((row): row is NonNullable<typeof row> => Boolean(row));
      const draftResponse = await supabaseRequest("cardinal_drafts", {
        method: "POST",
        body: JSON.stringify(
          input.drafts.map((draft) => ({
            run_id: run?.id,
            name: draft.name ?? null,
            affiliate_url: draft.affiliateUrl ?? null,
            original_url: draft.originalUrl ?? null,
            network: draft.network ?? null,
            payload: draft,
            rejection_reasons: draft.rejectionReasons,
            status: autopublishRows.some((row) => row.affiliate_url === draft.affiliateUrl) ? "autopublished" : "needs_enrichment",
          })),
        ),
      });
      if (!draftResponse.ok) return { ok: false, status: draftResponse.status, reason: await draftResponse.text() };

      if (autopublishRows.length > 0) {
        const productResponse = await supabaseRequest("products?on_conflict=slug", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify(autopublishRows),
        });
        if (!productResponse.ok) return { ok: false, status: productResponse.status, reason: await productResponse.text() };
      }
    }

    return { ok: true, runId: run?.id };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "supabase-failed" };
  }
}

export async function upsertProductsToSupabase(products: Product[]) {
  if (!isSupabaseConfigured()) return { ok: false, skipped: true, reason: "supabase-not-configured" };

  try {
    const response = await supabaseRequest("products?on_conflict=slug", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(products.map(productToSupabaseRow)),
    });

    if (!response.ok) return { ok: false, status: response.status, reason: await response.text() };
    return { ok: true, count: products.length };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "supabase-upsert-failed" };
  }
}

type SupabaseProductRow = {
  slug: string;
  name: string;
  category: Category;
  subcategory: string;
  brand: string;
  price: number;
  old_price?: number | null;
  rating?: number | null;
  rating_count?: number | null;
  sales_count?: number | null;
  image_url: string;
  affiliate_url: string;
  palette?: [string, string] | null;
  offers?: Product["offers"] | null;
  price_history?: number[] | null;
  found_minutes_ago?: number | null;
  tags?: string[] | null;
  description: string;
  source?: string | null;
  last_verified_at?: string | null;
  network?: Product["network"] | null;
  status?: Product["status"] | null;
};

export function rowToProduct(row: SupabaseProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    brand: row.brand,
    price: Number(row.price ?? 0),
    oldPrice: row.old_price ?? undefined,
    rating: row.rating ?? undefined,
    ratingCount: row.rating_count ?? undefined,
    salesCount: row.sales_count ?? undefined,
    image: row.image_url,
    affiliateUrl: row.affiliate_url,
    palette: row.palette ?? ["#111111", "#ff5a1f"],
    offers: row.offers?.length ? row.offers : [{ store: row.brand, price: Number(row.price ?? 0), affiliateReady: true, isBest: true }],
    priceHistory: row.price_history ?? [],
    foundMinutesAgo: row.found_minutes_ago ?? 1,
    tags: row.tags ?? [],
    description: row.description,
    source: row.source ?? undefined,
    lastVerifiedAt: row.last_verified_at ?? undefined,
    network: row.network ?? undefined,
    status: row.status ?? "published",
  };
}

export async function getSupabasePublishedProducts() {
  if (!isSupabaseConfigured()) return [];

  try {
    const response = await supabaseRequest("products?select=*&status=eq.published&order=updated_at.desc", {
      method: "GET",
      headers: { Prefer: "" },
    });
    if (!response.ok) return [];
    const rows = (await response.json()) as SupabaseProductRow[];
    return rows.map(rowToProduct);
  } catch {
    return [];
  }
}

export async function getCardinalRecheckQueue(limit = 40) {
  if (!isSupabaseConfigured()) return [];

  const links = new Map<string, string>();

  try {
    const draftsResponse = await supabaseRequest(
      `cardinal_drafts?select=name,affiliate_url&status=in.(needs_enrichment,autopublished)&order=created_at.desc&limit=${limit}`,
      { method: "GET", headers: { Prefer: "" } },
    );
    if (draftsResponse.ok) {
      const drafts = (await draftsResponse.json()) as Array<{ name?: string | null; affiliate_url?: string | null }>;
      for (const draft of drafts) {
        if (draft.affiliate_url) links.set(draft.affiliate_url, draft.name ?? "");
      }
    }

    const productsResponse = await supabaseRequest(
      `products?select=name,affiliate_url&status=eq.published&price=eq.0&order=updated_at.desc&limit=${limit}`,
      { method: "GET", headers: { Prefer: "" } },
    );
    if (productsResponse.ok) {
      const products = (await productsResponse.json()) as Array<{ name?: string | null; affiliate_url?: string | null }>;
      for (const product of products) {
        if (product.affiliate_url) links.set(product.affiliate_url, product.name ?? "");
      }
    }
  } catch {
    return [...links.entries()].map(([link, name]) => ({ link, name }));
  }

  return [...links.entries()].map(([link, name]) => ({ link, name }));
}

export type TelegramPostRow = {
  id: string;
  product_slug: string;
  channel_id: string;
  message_id?: number | null;
  status: string;
  score: number;
  caption?: string | null;
  error?: string | null;
  posted_at?: string | null;
  created_at: string;
};

export async function getRecentTelegramPosts(limit = 24) {
  if (!isSupabaseConfigured()) return [] as TelegramPostRow[];

  try {
    const response = await supabaseRequest(
      `telegram_posts?select=*&order=created_at.desc&limit=${limit}`,
      { method: "GET", headers: { Prefer: "" } },
    );
    if (!response.ok) return [];
    return (await response.json()) as TelegramPostRow[];
  } catch {
    return [];
  }
}

export async function getTelegramPostStats() {
  const recent = await getRecentTelegramPosts(80);
  return {
    recent,
    sent: recent.filter((post) => post.status === "sent").length,
    failed: recent.filter((post) => post.status === "failed").length,
    queued: recent.filter((post) => post.status === "queued").length,
    lastSentAt: recent.find((post) => post.status === "sent")?.posted_at ?? null,
  };
}

export async function getRecentTelegramProductSlugs(limit = 30) {
  return (await getRecentTelegramPosts(limit))
    .filter((post) => post.status === "sent")
    .map((post) => post.product_slug);
}

export async function persistTelegramPost(input: {
  productSlug: string;
  channelId: string;
  status: "sent" | "failed" | "queued";
  score: number;
  caption?: string;
  messageId?: number;
  error?: string;
}) {
  if (!isSupabaseConfigured()) return { ok: false, skipped: true, reason: "supabase-not-configured" };

  try {
    const response = await supabaseRequest("telegram_posts", {
      method: "POST",
      body: JSON.stringify({
        product_slug: input.productSlug,
        channel_id: input.channelId,
        message_id: input.messageId ?? null,
        status: input.status,
        score: input.score,
        caption: input.caption ?? null,
        error: input.error ?? null,
        posted_at: input.status === "sent" ? new Date().toISOString() : null,
      }),
    });
    if (!response.ok) return { ok: false, status: response.status, reason: await response.text() };
    const [row] = (await response.json()) as TelegramPostRow[];
    return { ok: true, row };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "telegram-post-persist-failed" };
  }
}
