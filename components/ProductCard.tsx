import Link from "next/link";
import ProductArt from "@/components/ProductArt";
import FavoriteButton from "@/components/FavoriteButton";
import SignalBadge from "@/components/SignalBadge";
import DealPop from "@/components/DealPop";
import { getCardinalIdentity } from "@/lib/cardinal-identity";
import { discountPct, formatBRL, formatPrice, savings, socialProof, type Product } from "@/lib/products";
import { getPrimarySignal } from "@/lib/signals";

export default function ProductCard({
  product,
  priority = false,
  featured = false,
}: {
  product: Product;
  priority?: boolean;
  featured?: boolean;
}) {
  const discount = discountPct(product);
  const signal = getPrimarySignal(product);
  const store = product.offers[0]?.store;
  const proof = socialProof(product);
  const identity = getCardinalIdentity(product);

  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.035] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-signal/35 hover:bg-white/[0.055]" data-cardinal-mood={identity.mood}>
      <Link href={`/produto/${product.slug}`} className="flex flex-1 flex-col">
        <div className={`product-glow relative overflow-hidden rounded-md ${featured ? "aspect-[4/5]" : "aspect-[4/5]"}`}>
          <ProductArt product={product} className="h-full w-full" priority={priority} />
          <div className="absolute left-3 top-3 z-10">
            <SignalBadge signal={signal} />
          </div>
          <span className="absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-void/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-signal">
            {identity.temperatureLabel}
          </span>
          {discount > 0 && (
            <span className="absolute bottom-3 left-3 z-10 rounded-full bg-void/85 px-2.5 py-1 font-display text-xs font-bold">
              −{discount}%
            </span>
          )}
          <DealPop product={product} className="absolute bottom-3 left-3 z-10 max-w-[82%]" compact />
        </div>
        <div className="flex flex-1 flex-col px-1 pb-1 pt-4 pr-12">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mute">
            {product.subcategory}
            {store ? ` · ${store}` : ""}
          </p>
          <h3 className={`mt-1 font-display font-semibold leading-snug tracking-tight ${featured ? "text-2xl" : "text-base"}`}>
            {identity.commercialTitle}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-mute">{product.name}</p>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <p className={`font-display font-extrabold tracking-tight ${featured ? "text-3xl" : "text-xl"}`}>
              {formatPrice(product)}
            </p>
            {product.oldPrice && <p className="text-sm text-mute line-through">{formatBRL(product.oldPrice)}</p>}
          </div>
          {product.price > 0 && discount > 0 && <p className="mt-1 text-sm text-good">Economia {formatBRL(savings(product))}</p>}
          {proof.length > 0 && <p className="mt-2 text-xs text-mist">{proof.join(" · ")}</p>}
          <p className="mt-2 line-clamp-2 text-xs font-semibold text-fog/85">Cardinal: {identity.whisper}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {identity.badges.slice(0, 2).map((badge) => (
              <span key={badge} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold text-mist">
                {badge}
              </span>
            ))}
          </div>
          <span className="mt-3 hidden text-sm font-semibold text-signal opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:inline">
            Ver oferta
          </span>
        </div>
      </Link>
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton slug={product.slug} name={product.name} className="bg-void/70" />
      </div>
    </article>
  );
}
