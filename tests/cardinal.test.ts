import assert from "node:assert/strict";
import test from "node:test";
import { validateAffiliateUrl } from "../lib/affiliate-networks.ts";
import { validateImportBatch, validateImportItem } from "../lib/affiliate-import.ts";
import { sanitizeCardinalEvent } from "../lib/observability.ts";
import {
  ALL_SHEIN_AFFILIATE_LINKS,
  GUSTAVO_AFFILIATE_LINKS,
  GUSTAVO_DRAFT_IMPORT_REPORT,
  importAffiliateLinkDrafts,
  SHEIN_AFFILIATE_LINKS,
  SHEIN_AFFILIATE_LINKS_SECOND_BATCH,
  SHEIN_DRAFT_IMPORT_REPORT,
} from "../lib/affiliate-draft-batch.ts";

const validItem = {
  name: "  Produto real  ",
  imageUrl: "https://img.ltwebstatic.com/item.webp",
  currentPrice: 79.9,
  previousPrice: 99.9,
  affiliateUrl: "https://onelink.shein.com/52/item",
  lastVerifiedAt: "2026-09-12T12:00:00.000Z",
  source: "manual-import",
  tags: [" streetwear ", "streetwear", ""],
};

test("accepts a complete normalized draft", () => {
  const draft = validateImportItem(validItem);
  assert.equal(draft.rejectionReasons.length, 0);
  assert.equal(draft.name, "Produto real");
  assert.deepEqual(draft.tags, ["streetwear"]);
});

test("rejects incomplete and incoherent prices", () => {
  const draft = validateImportItem({ ...validItem, currentPrice: 0, previousPrice: 50, lastVerifiedAt: undefined });
  assert.ok(draft.rejectionReasons.includes("preço atual inválido"));
  assert.ok(draft.rejectionReasons.includes("campo ausente: lastVerifiedAt"));
  assert.ok(draft.rejectionReasons.includes("preço anterior menor que o preço atual") === false);
});

test("rejects unsupported affiliate domains and duplicate batches", () => {
  assert.equal(validateAffiliateUrl("https://example.com/product").valid, false);
  const result = validateImportBatch([validItem, validItem]);
  assert.equal(result.rejected.length, 1);
  assert.ok(result.rejected[0].rejectionReasons.includes("item duplicado no lote"));
});

test("sanitizes analytics payload without personal data", () => {
  const event = sanitizeCardinalEvent({ name: "search", route: "/ofertas?email=user@example.com", queryLength: 999 });
  assert.equal(event.queryLength, 200);
  assert.equal("email" in event, false);
  assert.equal(event.route.length, 31);
});

test("imports the supplied SHEIN batch as unpublished enrichment drafts", () => {
  const report = importAffiliateLinkDrafts(SHEIN_AFFILIATE_LINKS, new Set(), "2026-09-12T00:00:00.000Z");
  assert.equal(report.received, 26);
  assert.equal(report.created.length, 26);
  assert.equal(report.duplicates.length, 0);
  assert.equal(report.rejected.length, 0);
  assert.ok(report.created.every((draft) => draft.status === "draft"));
  assert.ok(report.created.every((draft) => draft.enrichmentStatus === "pending_enrichment"));
  assert.ok(report.created.every((draft) => draft.source === "manual-affiliate-link"));
});

test("deduplicates a re-applied affiliate batch", () => {
  const first = importAffiliateLinkDrafts(SHEIN_AFFILIATE_LINKS, new Set(), "2026-09-12T00:00:00.000Z");
  const existing = new Set(first.created.map((draft) => draft.affiliateUrl));
  const second = importAffiliateLinkDrafts(SHEIN_AFFILIATE_LINKS, existing, "2026-09-12T00:01:00.000Z");
  assert.equal(second.created.length, 0);
  assert.equal(second.duplicates.length, 26);
  assert.equal(second.rejected.length, 0);
});

test("consolidates both SHEIN batches without public publication", () => {
  assert.equal(SHEIN_AFFILIATE_LINKS.length, 26);
  assert.equal(SHEIN_AFFILIATE_LINKS_SECOND_BATCH.length, 35);
  assert.equal(ALL_SHEIN_AFFILIATE_LINKS.length, 61);
  assert.equal(SHEIN_DRAFT_IMPORT_REPORT.received, 61);
  assert.equal(SHEIN_DRAFT_IMPORT_REPORT.created.length, 57);
  assert.equal(SHEIN_DRAFT_IMPORT_REPORT.published.length, 4);
  assert.equal(SHEIN_DRAFT_IMPORT_REPORT.duplicates.length, 0);
  assert.equal(SHEIN_DRAFT_IMPORT_REPORT.rejected.length, 0);
  assert.ok(SHEIN_DRAFT_IMPORT_REPORT.created.every((draft) => draft.status === "draft"));
  assert.ok(SHEIN_DRAFT_IMPORT_REPORT.created.every((draft) => draft.enrichmentStatus === "pending_enrichment"));
});

test("tracks Gustavo supplied links across supported affiliate networks", () => {
  assert.equal(GUSTAVO_AFFILIATE_LINKS.length, 19);
  assert.equal(GUSTAVO_DRAFT_IMPORT_REPORT.received, 19);
  assert.equal(GUSTAVO_DRAFT_IMPORT_REPORT.rejected.length, 0);
  assert.equal(GUSTAVO_DRAFT_IMPORT_REPORT.published.length, 19);
  assert.equal(GUSTAVO_DRAFT_IMPORT_REPORT.created.length, 0);
});
