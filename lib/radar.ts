import { discountPct, opportunityScore, type Product } from "@/lib/products";

export type RadarInsight = {
  label: string;
  detail: string;
  tone: "hot" | "steady" | "watch";
};

export function getRadarInsight(product: Product): RadarInsight {
  const discount = discountPct(product);
  const historyLow = Math.min(...product.priceHistory) >= product.price;

  if (discount >= 25 && historyLow) {
    return { label: "queda forte", detail: "preço atual no menor patamar do histórico", tone: "hot" };
  }

  if (discount >= 10) {
    return { label: "boa janela", detail: "desconto relevante para acompanhar", tone: "steady" };
  }

  return { label: "em observação", detail: "vale comparar novamente antes de decidir", tone: "watch" };
}

export function getRadarStats(products: Product[]) {
  const ranked = [...products].sort((a, b) => opportunityScore(b) - opportunityScore(a));
  const discounts = products.map(discountPct);

  return {
    tracked: products.length,
    strongestDiscount: Math.max(...discounts, 0),
    topProduct: ranked[0],
    lastScanMinutes: Math.min(...products.map((product) => product.foundMinutesAgo)),
  };
}