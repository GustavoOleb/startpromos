import { getProductBySlugLive } from "@/lib/products";
import { recordClickEvent } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlugLive(slug);

  if (!product) return NextResponse.redirect(new URL("/ofertas", request.url));

  await recordClickEvent({
    productSlug: product.slug,
    source: request.nextUrl.searchParams.get("src") ?? "site",
    userAgent: request.headers.get("user-agent"),
    referer: request.headers.get("referer"),
  });

  return NextResponse.redirect(product.affiliateUrl, 302);
}
