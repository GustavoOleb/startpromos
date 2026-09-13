import { NextResponse } from "next/server";
import { getConfiguredNetworks } from "@/lib/affiliate-networks";
import { getPublishedProducts } from "@/lib/products";
import { getRadarStats } from "@/lib/radar";

export const dynamic = "force-dynamic";

export function GET() {
  const stats = getRadarStats(getPublishedProducts());

  return NextResponse.json({
    status: "ready",
    engine: "price-history-v1",
    trackedOffers: stats.tracked,
    strongestDiscount: stats.strongestDiscount,
    lastScanMinutes: stats.lastScanMinutes,
    configuredNetworks: getConfiguredNetworks().map(({ id, label }) => ({ id, label })),
  });
}
