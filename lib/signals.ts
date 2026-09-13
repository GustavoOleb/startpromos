import { discountPct, hasUsableHistory, lowestObserved, type Product } from "./products.ts";

export type SignalKind =
  | "price-drop"
  | "new-find"
  | "interesting-price"
  | "lowest-observed"
  | "watching"
  | "limited-history";

export type RadarSignal = {
  kind: SignalKind;
  label: string;
};

const PRIORITY: SignalKind[] = [
  "price-drop",
  "lowest-observed",
  "interesting-price",
  "new-find",
  "limited-history",
  "watching",
];

export function getProductSignals(product: Product): RadarSignal[] {
  const signals: RadarSignal[] = [];
  const discount = discountPct(product);
  const low = lowestObserved(product);

  if (product.oldPrice && discount >= 20) {
    signals.push({ kind: "price-drop", label: "Queda detectada" });
  } else if (product.oldPrice && discount > 0) {
    signals.push({ kind: "interesting-price", label: "Preço interessante" });
  }

  if (hasUsableHistory(product) && low !== null && product.price <= low) {
    signals.push({ kind: "lowest-observed", label: "Menor preço observado" });
  }

  if (product.foundMinutesAgo <= 5) {
    signals.push({ kind: "new-find", label: "Novo achado" });
  }

  if (!hasUsableHistory(product)) {
    signals.push({ kind: "limited-history", label: "Histórico limitado" });
  }

  if (signals.length === 0) {
    signals.push({ kind: "watching", label: "Em observação" });
  }

  return signals;
}

export function getPrimarySignal(product: Product): RadarSignal {
  const signals = getProductSignals(product);
  return [...signals].sort((a, b) => PRIORITY.indexOf(a.kind) - PRIORITY.indexOf(b.kind))[0];
}

export function signalTone(kind: SignalKind) {
  if (kind === "price-drop" || kind === "lowest-observed") return "alert";
  if (kind === "interesting-price" || kind === "new-find") return "live";
  return "mute";
}
