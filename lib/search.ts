import { categories, type Category, type Product } from "./products.ts";
import { discountPct } from "./products.ts";
import { getProductSignals, type SignalKind } from "./signals.ts";

export type SortKey = "relevance" | "discount" | "price-asc" | "price-desc" | "recent";

export type OfferFilters = {
  query?: string;
  category?: Category | "all";
  signal?: SignalKind | "all";
  minDiscount?: number;
  sort?: SortKey;
};

export function normalizeQuery(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export function normalizeCategory(value?: string | string[] | null): Category | "all" {
  const raw = Array.isArray(value) ? value[0] : value;
  return categories.some((category) => category.slug === raw) ? (raw as Category) : "all";
}

export function searchCatalog(products: Product[], query: string) {
  const q = query.trim().toLocaleLowerCase("pt-BR");
  if (!q) return products;
  const tokens = q.split(/\s+/).filter(Boolean);

  return products.filter((product) => {
    const hay = [product.name, product.brand, product.category, product.subcategory, product.description, ...product.tags]
      .join(" ")
      .toLocaleLowerCase("pt-BR");
    return tokens.every((token) => hay.includes(token));
  });
}

export function suggestCatalog(products: Product[], query: string, limit = 6) {
  return searchCatalog(products, query).slice(0, limit);
}

export function filterOffers(products: Product[], filters: OfferFilters) {
  let next = products;

  if (filters.query) next = searchCatalog(next, filters.query);
  if (filters.category && filters.category !== "all") {
    next = next.filter((product) => product.category === filters.category);
  }
  if (filters.signal && filters.signal !== "all") {
    next = next.filter((product) => getProductSignals(product).some((signal) => signal.kind === filters.signal));
  }
  if (filters.minDiscount && filters.minDiscount > 0) {
    next = next.filter((product) => discountPct(product) >= filters.minDiscount!);
  }

  const sort = filters.sort ?? "relevance";
  return [...next].sort((a, b) => {
    if (sort === "discount") return discountPct(b) - discountPct(a);
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "recent") return a.foundMinutesAgo - b.foundMinutesAgo;
    return discountPct(b) - discountPct(a) || a.foundMinutesAgo - b.foundMinutesAgo;
  });
}
