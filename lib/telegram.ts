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
  return 60 + discountPct(product) + (product.price === 0 ? 4 : 0) + (product.ratingCount ? 6 : 0) + (product.salesCount ? 6 : 0);
}

export function buildTelegramCaption(product: Product) {
  const discount = discountPct(product);
  const price = formatPrice(product);
  const opener = publicOfferOpener(product);
  const priceLine = product.price > 0 ? `💰 <b>${escapeHtml(price)}</b>` : "💰 <b>Preço especial na loja</b>";
  const discountLine = product.price > 0 && discount > 0 ? `⚡ ${discount}% OFF` : "⚡ Oferta disponível agora";
  const proof = publicProofLine(product);

  return trimTelegramCaption([
    opener,
    "",
    `<b>${escapeHtml(product.name)}</b>`,
    "",
    priceLine,
    discountLine,
    proof,
    "",
    "👉 Toque no botão para ver na loja:",
  ].filter(Boolean).join("\n"));
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
  const dealUrl = publicDealUrl(product);
  const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: config.channelId,
      photo: productImageUrl(product),
      caption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "🔥 Ver oferta", url: dealUrl }]],
      },
    }),
  });

  const data = await response.json().catch(() => null) as { ok?: boolean; result?: { message_id?: number }; description?: string } | null;
  if (!response.ok || !data?.ok) {
    const fallback = await sendTelegramTextProduct(product, caption);
    if (fallback.ok) return fallback;
    return { ok: false as const, error: fallback.error || data?.description || `telegram-http-${response.status}`, caption };
  }

  return { ok: true as const, messageId: data.result?.message_id, caption };
}

async function sendTelegramTextProduct(product: Product, caption: string) {
  const config = getTelegramConfig();
  if (!config.botToken || !config.channelId) {
    return { ok: false as const, error: "telegram-not-configured", caption };
  }

  const dealUrl = publicDealUrl(product);
  const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: config.channelId,
      text: trimTelegramCaption(`${caption}\n\n${escapeHtml(dealUrl)}`),
      parse_mode: "HTML",
      disable_web_page_preview: false,
      reply_markup: {
        inline_keyboard: [[{ text: "🔥 Ver oferta", url: dealUrl }]],
      },
    }),
  });

  const data = await response.json().catch(() => null) as { ok?: boolean; result?: { message_id?: number }; description?: string } | null;
  if (!response.ok || !data?.ok) {
    return { ok: false as const, error: data?.description ?? `telegram-text-http-${response.status}`, caption };
  }

  return { ok: true as const, messageId: data.result?.message_id, caption };
}

function publicOfferOpener(product: Product) {
  const openers = [
    "🔥 Oferta encontrada!",
    "🚨 Promoção passando agora!",
    "💥 Achado bom para conferir!",
    "🛍️ Olha essa oferta!",
    "⚡ Oferta rápida!",
  ];
  return openers[hashString(product.slug) % openers.length];
}

function publicProofLine(product: Product) {
  const proof = [];
  if (product.rating && product.ratingCount) proof.push(`⭐ ${product.rating.toFixed(1)} com ${compact(product.ratingCount)} avaliações`);
  if (product.salesCount) proof.push(`🛒 ${compact(product.salesCount)} vendidos`);
  return proof.join("\n");
}

function compact(value: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function trimTelegramCaption(value: string) {
  return value.slice(0, 950);
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
