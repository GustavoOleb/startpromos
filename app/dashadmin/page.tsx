import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import { getPublishedProductsLive } from "@/lib/products";
import { getSupabaseHealth, getTelegramPostStats } from "@/lib/supabase";
import { getTelegramConfig, isTelegramConfigured } from "@/lib/telegram";

export const metadata: Metadata = {
  title: "Dash Admin",
  robots: { index: false, follow: false },
};

export default async function DashAdminPage() {
  const supabaseHealth = await getSupabaseHealth();
  const telegramStats = await getTelegramPostStats();
  const telegramConfig = getTelegramConfig();

  return (
    <AdminDashboard
      products={await getPublishedProductsLive()}
      supabaseReady={supabaseHealth.schemaReady}
      supabaseHealth={supabaseHealth}
      telegram={{
        configured: isTelegramConfigured(),
        intervalMinutes: telegramConfig.intervalMinutes,
        sent: telegramStats.sent,
        failed: telegramStats.failed,
        queued: telegramStats.queued,
        lastSentAt: telegramStats.lastSentAt,
        recent: telegramStats.recent.slice(0, 6).map((post) => ({
          productSlug: post.product_slug,
          status: post.status,
          score: post.score,
          postedAt: post.posted_at,
          error: post.error,
        })),
      }}
    />
  );
}
