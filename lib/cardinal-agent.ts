import { validateImportBatch, type ImportProductInput } from "@/lib/affiliate-import";
import { extractProductData, type ExtractionAttempt } from "@/lib/cardinal-extractor";
import { persistCardinalRun } from "@/lib/supabase";

export type CardinalScanInput = {
  links: string[];
  names?: string[];
};

export type CardinalScanResult = {
  scannedAt: string;
  checkedLinks: number;
  accepted: number;
  rejected: number;
  drafts: ReturnType<typeof validateImportBatch>["drafts"];
  notes: string[];
  attempts: ExtractionAttempt[];
  persistence?: Awaited<ReturnType<typeof persistCardinalRun>>;
};

function inferNetwork(url: string): ImportProductInput["network"] {
  if (url.includes("tiktok.com")) return "tiktok-shop";
  if (url.includes("shein.com")) return "shein";
  if (url.includes("shopee.")) return "shopee";
  return undefined;
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

export async function createCardinalDrafts(input: CardinalScanInput): Promise<CardinalScanResult> {
  const now = new Date().toISOString();
  const enriched = await Promise.all(input.links.map(async (link, index): Promise<ImportProductInput & { attempts?: ExtractionAttempt[] }> => {
    const name = input.names?.[index]?.trim();
    const extracted = await extractProductData(link.trim(), name);
    return {
      ...extracted,
      slug: name ? slugify(name) : undefined,
      name: extracted.name ?? name,
      affiliateUrl: link.trim(),
      originalUrl: link.trim(),
      network: extracted.network ?? inferNetwork(link),
      source: extracted.source ?? link.trim(),
      lastVerifiedAt: extracted.lastVerifiedAt ?? now,
      tags: (extracted.tags?.length ? extracted.tags : name ? name.split(/\s+/).slice(0, 6) : []).filter(Boolean),
      attempts: extracted.attempts,
    };
  }));
  const attempts = enriched.flatMap((item) => item.attempts ?? []);
  const batch = validateImportBatch(enriched);
  const notes = [
    "O Cardinal expandiu links, tentou ler metadados e buscou sinais externos antes de criar rascunhos.",
    "Itens sem preço, imagem ou avaliações seguem como rascunho para enriquecimento, sem inventar dado público.",
    "Quando o marketplace bloqueia HTML ou esconde preço no app, o fallback por busca do nome continua sendo usado.",
  ];
  const persistence = await persistCardinalRun({
    checkedLinks: input.links.length,
    accepted: batch.accepted.length,
    rejected: batch.rejected.length,
    notes,
    drafts: batch.drafts,
  });

  return {
    scannedAt: now,
    checkedLinks: input.links.length,
    accepted: batch.accepted.length,
    rejected: batch.rejected.length,
    drafts: batch.drafts,
    notes,
    attempts,
    persistence,
  };
}
