import { NextResponse } from "next/server";
import { getTelegramPostStats } from "@/lib/supabase";
import { getTelegramConfig, isTelegramConfigured } from "@/lib/telegram";

export async function GET() {
  const stats = await getTelegramPostStats();
  const config = getTelegramConfig();
  return NextResponse.json({
    configured: isTelegramConfigured(),
    channelId: config.channelId ? "configured" : "missing",
    intervalMinutes: config.intervalMinutes,
    sent: stats.sent,
    failed: stats.failed,
    queued: stats.queued,
    lastSentAt: stats.lastSentAt,
    recent: stats.recent.slice(0, 8),
  });
}
