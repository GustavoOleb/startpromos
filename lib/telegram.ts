import { getCardinalIdentity } from "@/lib/cardinal-identity";
import { discountPct, formatPrice, productImageUrl, type Product } from "@/lib/products";

export type TelegramConfig = {
  botToken?: string;
  channelId?: string;
  intervalMinutes: number;
};

export function getTelegramConfig(): TelegramConfig {
  return {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    channelId: process.env.TELEGRAM_CHANNEL_ID,
    intervalMinutes: Number(process.env.TELEGRAM_POST_INTERVAL_MINUTES ?? 60),
  };
}

export function isTelegramConfigured() {
  const config = getTelegramConfig();
  return Boolean(config.botToken && config.channelId);
}

export function telegramProductScore(product: Product) {
  const identity = getCardinalIdentity(product);
  return identity.impulseScore + discountPct(product) + (product.price === 0 ? 6 : 0) + (product.ratingCount ? 6 : 0);
}

export function buildTelegramCaption(product: Product) {
  const identity = getCardinalIdentity(product);
  const discount = discountPct(product);
  const tags = identity.badges.slice(0, 3).join(" · ");
  const price = formatPrice(product);
  const discountLine = product.price > 0 && discount > 0 ? `\n📉 Economia detectada: -${discount}%` : "";

  return [
    `🔥 ${identity.temperatureLabel.toUpperCase()} PELO CARDINAL`,
    "",
    `<b>${escapeHtml(identity.commercialTitle)}</b>`,
    escapeHtml(product.name),
    "",
    `💸 <b>${escapeHtml(price)}</b>${discountLine}`,
    `🧠 ${escapeHtml(identity.verdict)}`,
    `⚡ Dopamina ${identity.dopamineScore} · Impulso ${identity.impulseScore}`,
    tags ? `📌 ${escapeHtml(tags)}` : "",
    "",
    `<i>${escapeHtml(identity.whisper)}</i>`,
  ].filter(Boolean).join("\n");
}

export function publicDealUrl(product: Product) {
  return product.affiliateUrl;
}

export async function sendTelegramProduct(product: Product) {
  const config = getTelegramConfig();
  if (!config.botToken || !config.channelId) {
    return { ok: false as const, error: "telegram-not-configured" };
  }

  const caption = buildTelegramCaption(product);
  const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: config.channelId,
      photo: productImageUrl(product),
      caption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "🔥 Ver oferta", url: publicDealUrl(product) }]],
      },
    }),
  });

  const data = await response.json().catch(() => null) as { ok?: boolean; result?: { message_id?: number }; description?: string } | null;
  if (!response.ok || !data?.ok) {
    return { ok: false as const, error: data?.description ?? `telegram-http-${response.status}`, caption };
  }

  return { ok: true as const, messageId: data.result?.message_id, caption };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
