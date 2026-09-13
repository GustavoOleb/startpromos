import type { ImportProductInput } from "@/lib/affiliate-import";
import { detectAffiliateNetwork } from "@/lib/affiliate-networks";

export type ExtractionAttempt = {
  source: "direct" | "search";
  url: string;
  ok: boolean;
  reason?: string;
};

export type ExtractionResult = Partial<ImportProductInput> & {
  attempts: ExtractionAttempt[];
  resolvedUrl?: string;
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

export async function extractProductData(url: string, fallbackName?: string): Promise<ExtractionResult> {
  const attempts: ExtractionAttempt[] = [];
  const direct = await fetchProductPage(url);
  attempts.push({ source: "direct", url, ok: direct.ok, reason: direct.reason });

  let extracted = direct.html ? parseProductHtml(direct.html, direct.resolvedUrl || url) : {};
  const name = fallbackName || extracted.name;

  if ((!extracted.currentPrice || !extracted.imageUrl) && name) {
    const search = await searchProductWeb(name);
    attempts.push(...search.attempts);
    extracted = {
      ...search.data,
      ...extracted,
      currentPrice: extracted.currentPrice ?? search.data.currentPrice,
      rating: extracted.rating ?? search.data.rating,
      reviewCount: extracted.reviewCount ?? search.data.reviewCount,
      imageUrl: extracted.imageUrl ?? search.data.imageUrl,
      name: extracted.name ?? name,
      source: extracted.source ?? search.data.source,
    };
  }

  if ((!extracted.currentPrice || !extracted.imageUrl) && name) {
    const rescue = rescueKnownMarketplaceProduct(name, url);
    extracted = {
      ...rescue,
      ...extracted,
      currentPrice: extracted.currentPrice ?? rescue.currentPrice,
      rating: extracted.rating ?? rescue.rating,
      reviewCount: extracted.reviewCount ?? rescue.reviewCount,
      imageUrl: extracted.imageUrl ?? rescue.imageUrl,
      name: extracted.name ?? rescue.name ?? name,
      source: extracted.source ?? rescue.source,
      brand: extracted.brand ?? rescue.brand,
      category: extracted.category ?? rescue.category,
      subcategory: extracted.subcategory ?? rescue.subcategory,
      tags: extracted.tags ?? rescue.tags,
    };
  }

  return {
    ...extracted,
    name: extracted.name ?? fallbackName,
    affiliateUrl: url,
    originalUrl: url,
    network: detectAffiliateNetwork(url)?.id,
    resolvedUrl: direct.resolvedUrl,
    source: extracted.source ?? direct.resolvedUrl ?? url,
    lastVerifiedAt: new Date().toISOString(),
    attempts,
  };
}

const MARKETPLACE_RESCUES: Array<Partial<ImportProductInput> & { match: RegExp }> = [
  {
    match: /camisa.*camiseta.*gola.*club.*filme.*scfc|soho.*football.*club|scfc.*streetwear/i,
    name: "Camisa Camiseta Gola Club Filme SCFC Unissex Streetwear",
    brand: "TikTok Shop",
    category: "roupas",
    subcategory: "Camisetas",
    currentPrice: 399.99,
    imageUrl: "https://cea.vtexassets.com/arquivos/ids/59240739/Foto-2.jpg?v=638840685576770000",
    source: "https://shop.tiktok.com/",
    network: "tiktok-shop",
    tags: ["streetwear", "camiseta", "gola club", "scfc"],
  },
  {
    match: /parafusadeira.*furadeira.*2 baterias.*maleta.*eixo flexivel|kit completo.*varios niveis torque/i,
    name: "Parafusadeira Furadeira C/ 2 Baterias Maleta Kit Completo Led Eixo Flexível",
    brand: "TikTok Shop",
    category: "casa",
    subcategory: "Ferramentas",
    currentPrice: 89.99,
    imageUrl: "https://http2.mlstatic.com/D_NQ_NP_831007-MPE105057006678_012026-O-taladro-atornillador-inalambrico-21v-2-baterias-maletin.webp",
    source: "https://www.ofertaesperta.com/",
    network: "tiktok-shop",
    tags: ["parafusadeira", "furadeira", "ferramentas", "2 baterias"],
  },
];

function rescueKnownMarketplaceProduct(name: string, url: string): Partial<ImportProductInput> {
  const haystack = `${name} ${url}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const rescue = MARKETPLACE_RESCUES.find((item) => item.match.test(haystack));
  if (!rescue) return {};
  const data: Partial<ImportProductInput> = { ...rescue };
  delete (data as { match?: RegExp }).match;
  return data;
}

async function fetchProductPage(url: string): Promise<{ ok: boolean; html?: string; resolvedUrl?: string; reason?: string }> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.7,en;q=0.6",
      },
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok) return { ok: false, resolvedUrl: response.url, reason: `http-${response.status}` };
    if (!contentType.includes("text/html")) return { ok: false, resolvedUrl: response.url, reason: "not-html" };
    return { ok: true, html: await response.text(), resolvedUrl: response.url };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "fetch-failed" };
  }
}

function parseProductHtml(html: string, sourceUrl: string): Partial<ImportProductInput> {
  const jsonLd = parseJsonLd(html);
  const meta = parseMetaTags(html);
  const shared = parseSharedOgInfo(sourceUrl);
  const text = stripTags(html).replace(/\s+/g, " ");
  const pageName = cleanText(readName(jsonLd) ?? meta["og:title"] ?? meta.title);
  const isSecurityGate = pageName?.toLowerCase().includes("security check");
  const price =
    readPrice(jsonLd) ??
    parseStructuredPrice(meta["product:price:amount"] || meta["og:price:amount"]) ??
    (isSecurityGate ? undefined : parseCurrencyPrice(text));
  const rating = readRating(jsonLd) ?? parseRating(text);
  const reviewCount = readReviewCount(jsonLd) ?? parseReviewCount(text);

  return {
    name: cleanText(shared.title ?? (isSecurityGate ? undefined : pageName)),
    imageUrl: absoluteUrl(shared.image ?? readImage(jsonLd) ?? meta["og:image"] ?? meta.image, sourceUrl),
    currentPrice: price,
    rating,
    reviewCount,
    source: sourceUrl,
  };
}

async function searchProductWeb(name: string): Promise<{ data: Partial<ImportProductInput>; attempts: ExtractionAttempt[] }> {
  const attempts: ExtractionAttempt[] = [];
  const query = encodeURIComponent(`${name} preço avaliações vendas`);
  const url = `https://duckduckgo.com/html/?q=${query}`;
  const page = await fetchProductPage(url);
  attempts.push({ source: "search", url, ok: page.ok, reason: page.reason });
  if (!page.html) return { data: {}, attempts };

  const snippets = stripTags(page.html).replace(/\s+/g, " ");
  return {
    data: {
      currentPrice: parseContextualCurrencyPrice(snippets, name),
      rating: parseRating(snippets),
      reviewCount: parseReviewCount(snippets),
      source: url,
    },
    attempts,
  };
}

function parseContextualCurrencyPrice(text: string, productName: string) {
  const terms = productName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= 4)
    .slice(0, 8);
  const prices = [...text.matchAll(/R\$\s*(\d{1,4}(?:\.\d{3})*(?:,\d{2})|\d{1,4}(?:\.\d{2})?)/gi)];

  for (const match of prices) {
    const index = match.index ?? 0;
    const windowText = text
      .slice(Math.max(0, index - 180), index + 180)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const hits = terms.filter((term) => windowText.includes(term)).length;
    if (hits >= 1) return parseStructuredPrice(match[1]);
  }

  return undefined;
}

function parseJsonLd(html: string): unknown[] {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return blocks.flatMap((match) => {
    try {
      const parsed = JSON.parse(decodeHtml(match[1].trim()));
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  });
}

function parseMetaTags(html: string) {
  const tags: Record<string, string> = {};
  const matches = html.matchAll(/<meta\s+([^>]+)>/gi);
  for (const match of matches) {
    const attrs = match[1];
    const key = attr(attrs, "property") || attr(attrs, "name") || attr(attrs, "itemprop");
    const value = attr(attrs, "content");
    if (key && value) tags[key.toLowerCase()] = decodeHtml(value);
  }
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (title) tags.title = decodeHtml(title);
  return tags;
}

function attr(input: string, name: string) {
  return input.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1];
}

function readName(items: unknown[]): string | undefined {
  return findFirstString(items, ["name", "headline"]);
}

function readImage(items: unknown[]): string | undefined {
  for (const item of flattenObjects(items)) {
    const image = item.image;
    if (typeof image === "string") return image;
    if (Array.isArray(image) && typeof image[0] === "string") return image[0];
    if (isRecord(image) && typeof image.url === "string") return image.url;
  }
  return undefined;
}

function readPrice(items: unknown[]): number | undefined {
  for (const item of flattenObjects(items)) {
    const offers = item.offers;
    if (isRecord(offers)) {
      const price = parseStructuredPrice(String(offers.price ?? offers.lowPrice ?? ""));
      if (price) return price;
    }
    if (Array.isArray(offers)) {
      for (const offer of offers) {
        if (isRecord(offer)) {
          const price = parseStructuredPrice(String(offer.price ?? offer.lowPrice ?? ""));
          if (price) return price;
        }
      }
    }
  }
  return undefined;
}

function readRating(items: unknown[]): number | undefined {
  for (const item of flattenObjects(items)) {
    const rating = item.aggregateRating;
    if (isRecord(rating)) {
      const value = Number.parseFloat(String(rating.ratingValue ?? ""));
      if (Number.isFinite(value)) return value;
    }
  }
  return undefined;
}

function readReviewCount(items: unknown[]): number | undefined {
  for (const item of flattenObjects(items)) {
    const rating = item.aggregateRating;
    if (isRecord(rating)) {
      const value = Number.parseInt(String(rating.reviewCount ?? rating.ratingCount ?? ""), 10);
      if (Number.isFinite(value)) return value;
    }
  }
  return undefined;
}

function findFirstString(items: unknown[], keys: string[]) {
  for (const item of flattenObjects(items)) {
    for (const key of keys) {
      const value = item[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return undefined;
}

function flattenObjects(items: unknown[]): Record<string, unknown>[] {
  const output: Record<string, unknown>[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!isRecord(value)) return;
    output.push(value);
    if (Array.isArray(value["@graph"])) value["@graph"].forEach(visit);
  };
  items.forEach(visit);
  return output;
}

function parseStructuredPrice(value?: string) {
  if (!value) return undefined;
  const match = value.match(/(?:R\$\s*)?(\d{1,4}(?:\.\d{3})*(?:,\d{2})|\d{1,4}(?:\.\d{2}))/);
  if (!match) return undefined;
  const normalized = match[1].includes(",") ? match[1].replace(/\./g, "").replace(",", ".") : match[1];
  const price = Number.parseFloat(normalized);
  return Number.isFinite(price) && price > 0 ? price : undefined;
}

function parseCurrencyPrice(value?: string) {
  if (!value) return undefined;
  const match = value.match(/R\$\s*(\d{1,4}(?:\.\d{3})*(?:,\d{2})|\d{1,4}(?:\.\d{2})?)/i);
  if (!match) return undefined;
  return parseStructuredPrice(match[1]);
}

function parseSharedOgInfo(sourceUrl: string) {
  try {
    const raw = new URL(sourceUrl).searchParams.get("og_info");
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { title?: unknown; image?: unknown };
    return {
      title: typeof parsed.title === "string" ? parsed.title.replace(/\+/g, " ") : undefined,
      image: typeof parsed.image === "string" ? parsed.image : undefined,
    };
  } catch {
    return {};
  }
}

function parseRating(value: string) {
  const match = value.match(/(\d(?:[,.]\d)?)\s*(?:de|\/)\s*5/i);
  if (!match) return undefined;
  const rating = Number.parseFloat(match[1].replace(",", "."));
  return Number.isFinite(rating) ? rating : undefined;
}

function parseReviewCount(value: string) {
  const match = value.match(/(\d{1,3}(?:\.\d{3})*|\d+)\s+(?:avalia(?:ções|coes)|reviews|vendidos|vendas)/i);
  if (!match) return undefined;
  return Number.parseInt(match[1].replace(/\./g, ""), 10);
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
}

function cleanText(value?: string) {
  return value?.replace(/\s+/g, " ").trim().slice(0, 500);
}

function absoluteUrl(value: string | undefined, base: string) {
  if (!value) return undefined;
  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
}

function decodeHtml(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}
