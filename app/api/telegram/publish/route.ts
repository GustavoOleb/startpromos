import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidAdminSessionToken } from "@/lib/admin-auth";
import { publishTelegramProducts } from "@/lib/telegram-publisher";
import { getTelegramConfig, isTelegramConfigured } from "@/lib/telegram";
import { getTelegramPostStats } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  return handlePublish(request);
}

export async function POST(request: NextRequest) {
  return handlePublish(request);
}

async function handlePublish(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || process.env.CARDINAL_CRON_SECRET;
  const isLocalWithoutSecret = process.env.NODE_ENV !== "production" && !cronSecret;
  const isCronAuthorized = isLocalWithoutSecret || Boolean(cronSecret && auth === `Bearer ${cronSecret}`);
  const isAdminAuthorized = isValidAdminSessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!isCronAuthorized && !isAdminAuthorized) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  if (!isTelegramConfigured()) {
    return NextResponse.json({ ok: false, reason: "telegram-not-configured" }, { status: 503 });
  }

  const config = getTelegramConfig();
  const stats = await getTelegramPostStats();
  const force = request.nextUrl.searchParams.get("force") === "1";
  if (stats.lastSentAt) {
    const last = new Date(stats.lastSentAt).getTime();
    const waitMs = config.intervalMinutes * 60 * 1000;
    if (Date.now() - last < waitMs && !force) {
      return NextResponse.json({ ok: true, skipped: true, reason: "interval-wait", lastSentAt: stats.lastSentAt });
    }
  }

  const body = request.method === "POST" ? await request.json().catch(() => null) : null;
  const bodyRecord = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const slug = String(bodyRecord.slug ?? request.nextUrl.searchParams.get("slug") ?? "").trim() || undefined;
  const mass = bodyRecord.mass === true || request.nextUrl.searchParams.get("mass") === "1";
  const rawLimit = Number(bodyRecord.limit ?? request.nextUrl.searchParams.get("limit") ?? (mass ? undefined : process.env.TELEGRAM_CRON_BATCH_SIZE ?? 4));
  const preferredSlugs = Array.isArray(bodyRecord.preferredSlugs)
    ? bodyRecord.preferredSlugs.filter((value): value is string => typeof value === "string")
    : undefined;

  const result = await publishTelegramProducts({
    force,
    slug,
    mass,
    limit: Number.isFinite(rawLimit) ? rawLimit : undefined,
    preferredSlugs,
  });

  if (!result.ok && result.reason === "product-not-found") return NextResponse.json(result, { status: 404 });
  if (!result.ok && result.sent.length === 0) return NextResponse.json(result, { status: 502 });

  return NextResponse.json(result);
}
