import {
  categoryHref,
  discountPct,
  formatBRL,
  formatPrice,
  getPublishedProducts,
  getProductBySlugLive,
  getRelatedLive,
  productImageUrl,
  savings,
  socialProof,
} from "@/lib/products";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ProductArt from "@/components/ProductArt";
import SignalBadge from "@/components/SignalBadge";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButton from "@/components/ShareButton";
import AffiliateCta from "@/components/AffiliateCta";
import PriceHistory from "@/components/PriceHistory";
import ProductCard from "@/components/ProductCard";
import DealPop from "@/components/DealPop";
import CardinalIdentityPanel from "@/components/CardinalIdentityPanel";
import { getCardinalIdentity } from "@/lib/cardinal-identity";
import { getPrimarySignal } from "@/lib/signals";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return getPublishedProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugLive(slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${SITE.name}`,
      description: product.description,
      images: [{ url: productImageUrl(product), alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlugLive(slug);
  if (!product) notFound();

  const discount = discountPct(product);
  const signal = getPrimarySignal(product);
  const store = product.offers[0]?.store;
  const related = await getRelatedLive(product);
  const proof = socialProof(product);
  const identity = getCardinalIdentity(product);
  const verified = product.lastVerifiedAt
    ? new Date(product.lastVerifiedAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: productImageUrl(product),
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.price > 0 ? product.price : undefined,
      url: `${SITE.url}/produto/${product.slug}`,
    },
  };

  return (
    <article className="mx-auto max-w-[1400px] px-4 pb-28 pt-8 sm:px-6 lg:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <nav className="text-sm text-mute" aria-label="Trilha">
        <Link href="/" className="hover:text-fog">
          Início
        </Link>
        <span> / </span>
        <Link href={categoryHref(product.category)} className="hover:text-fog">
          {product.category}
        </Link>
        <span> / </span>
        <span className="text-mist">{product.brand}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="relative lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6] lg:aspect-[4/5]">
            <ProductArt product={product} className="h-full w-full" priority sizes="(max-width: 1024px) 100vw, 58vw" />
          </div>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <SignalBadge signal={signal} />
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-mute">
            {product.brand} · {product.subcategory}
            {store ? ` · ${store}` : ""}
          </p>
          <h1 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl">{identity.commercialTitle}</h1>
          <p className="mt-3 text-sm text-mute">{product.name}</p>
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <p className="font-display text-5xl font-extrabold">{formatPrice(product)}</p>
            {product.oldPrice && <p className="text-lg text-mute line-through">{formatBRL(product.oldPrice)}</p>}
          </div>
          <DealPop product={product} className="mt-4 max-w-full px-5 py-3 text-base shadow-[0_0_34px_rgba(255,90,31,0.38)]" />
          {product.price > 0 && discount > 0 && <p className="mt-2 text-good">Economia {formatBRL(savings(product))} · −{discount}%</p>}
          {proof.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {proof.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-mist">
                  {item}
                </span>
              ))}
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {identity.personality.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-mist">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm font-bold text-signal">{identity.nickname}</p>
          <p className="mt-6 max-w-md text-sm leading-6 text-mist">{product.description}</p>
          {verified && <p className="mt-4 text-xs text-mute">Última verificação: {verified}</p>}
          <div className="mt-8 hidden items-start gap-3 lg:flex">
            <div className="flex-1">
              <AffiliateCta href={product.affiliateUrl} />
            </div>
            <ShareButton url={`${SITE.url}/produto/${product.slug}`} title={product.name} />
            <FavoriteButton slug={product.slug} name={product.name} />
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <CardinalIdentityPanel product={product} />
        <PriceHistory product={product} />
        <div className="border border-white/10 p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-signal">Transparência</p>
          <p className="mt-3 text-sm leading-6 text-mist">
            A StartPromos não vende este produto. O Cardinal destaca o achado e o botão abre a loja de origem para
            conferir o preço atual.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl font-black">Também no radar</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-void/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-mute">{product.brand}</p>
            <p className="font-display text-lg font-extrabold">{formatPrice(product)}</p>
          </div>
          <ShareButton url={`${SITE.url}/produto/${product.slug}`} title={product.name} />
          <FavoriteButton slug={product.slug} name={product.name} />
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex min-h-12 items-center rounded-full bg-signal px-5 font-display text-sm font-bold text-void"
          >
            Ver oferta
          </a>
        </div>
      </div>
    </article>
  );
}
