import { NextRequest, NextResponse } from "next/server";
import { getPublishedProductsLive } from "@/lib/products";
import { getRecentTelegramProductSlugs, getTelegramPostStats, persistTelegramPost } from "@/lib/supabase";
import { getTelegramConfig, isTelegramConfigured, sendTelegramProduct, telegramProductScore } from "@/lib/telegram";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  if (!isTelegramConfigured()) {
    return NextResponse.json({ ok: false, reason: "telegram-not-configured" }, { status: 503 });
  }

  const config = getTelegramConfig();
  const stats = await getTelegramPostStats();
  if (stats.lastSentAt) {
    const last = new Date(stats.lastSentAt).getTime();
    const waitMs = config.intervalMinutes * 60 * 1000;
    if (Date.now() - last < waitMs && request.nextUrl.searchParams.get("force") !== "1") {
      return NextResponse.json({ ok: true, skipped: true, reason: "interval-wait", lastSentAt: stats.lastSentAt });
    }
  }

  const products = await getPublishedProductsLive();
  const recent = new Set(await getRecentTelegramProductSlugs(40));
  const ranked = products
    .filter((product) => product.image.startsWith("https://"))
    .filter((product) => !recent.has(product.slug))
    .sort((a, b) => telegramProductScore(b) - telegramProductScore(a));

  const product = ranked[0] ?? products.sort((a, b) => telegramProductScore(b) - telegramProductScore(a))[0];
  if (!product || !config.channelId) return NextResponse.json({ ok: false, reason: "no-product" }, { status: 404 });

  const score = telegramProductScore(product);
  const sent = await sendTelegramProduct(product);
  await persistTelegramPost({
    productSlug: product.slug,
    channelId: config.channelId,
    status: sent.ok ? "sent" : "failed",
    score,
    caption: sent.caption,
    messageId: sent.ok ? sent.messageId : undefined,
    error: sent.ok ? undefined : sent.error,
  });

  if (!sent.ok) return NextResponse.json({ ok: false, product: product.slug, reason: sent.error }, { status: 502 });

  return NextResponse.json({ ok: true, product: product.slug, score, messageId: sent.messageId });
}
