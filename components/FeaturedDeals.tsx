import Link from "next/link";
import ProductArt from "@/components/ProductArt";
import SignalBadge from "@/components/SignalBadge";
import FavoriteButton from "@/components/FavoriteButton";
import DealPop from "@/components/DealPop";
import { discountPct, formatBRL, formatPrice, savings, socialProof, type Product } from "@/lib/products";
import { getPrimarySignal } from "@/lib/signals";

export default function FeaturedDeals({ products }: { products: Product[] }) {
  const [lead, ...rest] = products;
  if (!lead) return null;
  const side = rest.slice(0, 3);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28" aria-labelledby="ofertas-detectadas">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal">Radar</p>
      <h2 id="ofertas-detectadas" className="mt-3 max-w-xl font-display text-4xl font-black tracking-tight sm:text-6xl">
        Ofertas detectadas
      </h2>
      <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-6">
        <LeadDeal product={lead} />
        <div className="grid gap-8 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
          {side.map((product) => (
            <SideDeal key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadDeal({ product }: { product: Product }) {
  const discount = discountPct(product);
  const signal = getPrimarySignal(product);
  const store = product.offers[0]?.store;
  const proof = socialProof(product);

  return (
    <article className="group relative lg:col-span-7">
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="product-glow relative aspect-[4/5] overflow-hidden sm:aspect-[16/11]">
          <ProductArt product={product} className="h-full w-full" priority sizes="(max-width: 1024px) 100vw, 58vw" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/40 to-transparent p-5 sm:p-8">
            <SignalBadge signal={signal} />
            <h3 className="mt-4 max-w-lg font-display text-3xl font-black tracking-tight sm:text-5xl">{product.name}</h3>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <p className="font-display text-4xl font-extrabold">{formatPrice(product)}</p>
              {product.oldPrice && <p className="text-mute line-through">{formatBRL(product.oldPrice)}</p>}
              {product.price > 0 && discount > 0 && <p className="text-good">−{discount}% · {formatBRL(savings(product))}</p>}
            </div>
            <DealPop product={product} className="mt-2" />
            {proof.length > 0 && <p className="mt-2 text-xs text-mist">{proof.join(" · ")}</p>}
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-mist">
              {product.subcategory}
              {store ? ` · ${store}` : ""}
            </p>
          </div>
        </div>
      </Link>
      <div className="absolute right-4 top-4">
        <FavoriteButton slug={product.slug} name={product.name} />
      </div>
    </article>
  );
}

function SideDeal({ product }: { product: Product }) {
  const signal = getPrimarySignal(product);
  const proof = socialProof(product);
  return (
    <article className="group grid grid-cols-[112px_1fr] gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-2 transition duration-300 hover:-translate-y-1 hover:border-signal/30 sm:grid-cols-1 lg:grid-cols-[140px_1fr]">
      <Link href={`/produto/${product.slug}`} className="relative aspect-[4/5] overflow-hidden rounded-md">
        <ProductArt product={product} className="h-full w-full" sizes="180px" />
      </Link>
      <div className="flex flex-col justify-center">
        <SignalBadge signal={signal} />
        <Link href={`/produto/${product.slug}`}>
          <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{product.name}</h3>
          <p className="mt-2 font-display text-2xl font-extrabold">{formatPrice(product)}</p>
          <DealPop product={product} className="mt-2" compact />
          {proof.length > 0 && <p className="mt-1 text-xs text-mute">{proof.join(" · ")}</p>}
        </Link>
      </div>
    </article>
  );
}
