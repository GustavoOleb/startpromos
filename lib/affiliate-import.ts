import { validateAffiliateUrl, type AffiliateNetwork } from "./affiliate-networks.ts";

export type ImportProductInput = {
  slug?: string;
  name?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  imageUrl?: string;
  currentPrice?: number;
  previousPrice?: number;
  rating?: number;
  reviewCount?: number;
  originalUrl?: string;
  affiliateUrl?: string;
  network?: AffiliateNetwork;
  tags?: string[];
  lastVerifiedAt?: string;
  source?: string;
};

export type ImportDraft = ImportProductInput & {
  status: "draft";
  rejectionReasons: string[];
};

const REQUIRED_FIELDS: Array<keyof ImportProductInput> = [
  "name",
  "imageUrl",
  "currentPrice",
  "affiliateUrl",
  "lastVerifiedAt",
  "source",
];

const MAX_TEXT_LENGTH = 500;

export function normalizeImportItem(input: ImportProductInput): ImportProductInput {
  return {
    ...input,
    name: input.name?.trim().slice(0, MAX_TEXT_LENGTH),
    brand: input.brand?.trim().slice(0, MAX_TEXT_LENGTH),
    category: input.category?.trim().slice(0, MAX_TEXT_LENGTH),
    subcategory: input.subcategory?.trim().slice(0, MAX_TEXT_LENGTH),
    imageUrl: input.imageUrl?.trim(),
    originalUrl: input.originalUrl?.trim(),
    affiliateUrl: input.affiliateUrl?.trim(),
    source: input.source?.trim().slice(0, MAX_TEXT_LENGTH),
    tags: input.tags
      ?.map((tag) => tag.trim().slice(0, 80))
      .filter(Boolean)
      .filter((tag, index, values) => values.indexOf(tag) === index)
      .slice(0, 20),
  };
}

export function validateImportItem(input: ImportProductInput): ImportDraft {
  input = normalizeImportItem(input);
  const rejectionReasons = REQUIRED_FIELDS.flatMap((field) => {
    const value = input[field];
    return value === undefined || value === null || value === "" ? [`campo ausente: ${field}`] : [];
  });

  if (input.currentPrice !== undefined && (!Number.isFinite(input.currentPrice) || input.currentPrice <= 0)) {
    rejectionReasons.push("preço atual inválido");
  }

  if (input.previousPrice !== undefined && (!Number.isFinite(input.previousPrice) || input.previousPrice < 0)) {
    rejectionReasons.push("preço anterior inválido");
  }

  if (input.previousPrice !== undefined && input.currentPrice !== undefined && input.previousPrice < input.currentPrice) {
    rejectionReasons.push("preço anterior menor que o preço atual");
  }

  if (input.reviewCount !== undefined && (!Number.isInteger(input.reviewCount) || input.reviewCount < 0)) {
    rejectionReasons.push("quantidade de avaliações inválida");
  }

  if (input.rating !== undefined && (!Number.isFinite(input.rating) || input.rating < 0 || input.rating > 5)) {
    rejectionReasons.push("avaliação fora do intervalo");
  }

  for (const [field, value] of [["imageUrl", input.imageUrl], ["originalUrl", input.originalUrl]] as const) {
    if (value) {
      try {
        if (new URL(value).protocol !== "https:") rejectionReasons.push(`${field} precisa usar HTTPS`);
      } catch {
        rejectionReasons.push(`${field} inválida`);
      }
    }
  }

  if (input.lastVerifiedAt && Number.isNaN(Date.parse(input.lastVerifiedAt))) {
    rejectionReasons.push("data de verificação inválida");
  }

  if (input.affiliateUrl) {
    const result = validateAffiliateUrl(input.affiliateUrl);
    if (!result.valid) rejectionReasons.push(`link afiliado inválido: ${result.reason}`);
    if (result.network && input.network && result.network.id !== input.network) {
      rejectionReasons.push("rede informada não corresponde ao domínio");
    }
  }

  return { ...input, status: "draft", rejectionReasons };
}

export function validateImportBatch(items: ImportProductInput[]) {
  const drafts = items.map(validateImportItem);
  const seen = new Set<string>();

  for (const draft of drafts) {
    const identity = draft.affiliateUrl ?? draft.slug ?? draft.name;
    if (identity && seen.has(identity)) draft.rejectionReasons.push("item duplicado no lote");
    if (identity) seen.add(identity);
  }

  return {
    drafts,
    accepted: drafts.filter((draft) => draft.rejectionReasons.length === 0),
    rejected: drafts.filter((draft) => draft.rejectionReasons.length > 0),
  };
}