import assert from "node:assert/strict";
import test from "node:test";
import { isAllowedAffiliateUrl } from "../lib/affiliate-networks.ts";
import { discountPct, getActiveCategories, getPublishedProducts, products, savings } from "../lib/products.ts";
import { filterOffers, searchCatalog } from "../lib/search.ts";
import { getPrimarySignal, getProductSignals } from "../lib/signals.ts";

test("search matches brand and tags without fabricating results", () => {
  const hits = searchCatalog(products, "oversized");
  assert.ok(hits.length > 0);
  assert.ok(hits.every((product) => `${product.name} ${product.tags.join(" ")}`.toLocaleLowerCase("pt-BR").includes("oversized")));
});

test("discount and savings only exist when oldPrice is present", () => {
  const withOld = products.find((product) => product.oldPrice);
  const withoutOld = products.find((product) => !product.oldPrice);
  assert.ok(withOld && withoutOld);
  assert.ok(discountPct(withOld) > 0);
  assert.equal(discountPct(withoutOld), 0);
  assert.equal(savings(withoutOld), 0);
});

test("limited history signal appears when series is too short", () => {
  const short = products.find((product) => product.priceHistory.length <= 1);
  assert.ok(short);
  assert.ok(getProductSignals(short).some((signal) => signal.kind === "limited-history"));
});

test("filters never invent extra catalog items", () => {
  const filtered = filterOffers(products, { minDiscount: 20, sort: "discount" });
  assert.ok(filtered.length <= products.length);
  assert.ok(filtered.every((product) => discountPct(product) >= 20));
  assert.ok(filtered.every((product) => products.some((item) => item.slug === product.slug)));
});

test("every product has a primary signal", () => {
  for (const product of products) {
    assert.ok(getPrimarySignal(product).label.length > 0);
  }
});

test("published catalog only exposes usable affiliate destinations", () => {
  const published = getPublishedProducts();
  assert.ok(published.length > 0);
  assert.ok(published.every((product) => product.image.startsWith("https://")));
  assert.ok(published.every((product) => isAllowedAffiliateUrl(product.affiliateUrl)));
});

test("category navigation only exposes categories with published products", () => {
  const active = getActiveCategories();
  assert.ok(active.length > 0);
  assert.ok(active.every((category) => getPublishedProducts().some((product) => product.category === category.slug)));
  assert.equal(active.some((category) => category.slug === "perfumes"), false);
});
