import Link from "next/link";
import ProductArt from "@/components/ProductArt";
import { getCardinalIdentity } from "@/lib/cardinal-identity";
import { formatPrice, type Product } from "@/lib/products";

export default function CardinalShowcases({ products }: { products: Product[] }) {
  const enriched = products.map((product) => ({ product, identity: getCardinalIdentity(product) }));
  const regret = [...enriched].sort((a, b) => b.identity.impulseScore - a.identity.impulseScore).slice(0, 4);
  const expensive = enriched
    .filter((item) => item.identity.badges.includes("Coisa que parece cara") || item.identity.mood === "luxo")
    .slice(0, 4);
  const raw = enriched.filter((item) => item.product.price === 0 || item.identity.garimpoState === "Garimpo cru").slice(0, 4);
  const rows = [
    { title: "Radar de arrependimento", eyebrow: "anti-passou-bateu", items: regret },
    { title: "Coisas que parecem caras", eyebrow: "valor percebido", items: expensive.length ? expensive : regret },
    { title: "Garimpo cru", eyebrow: "bastidor premium", items: raw.length ? raw : regret },
  ];

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal">Cardinal vivo</p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl">Garimpos com instinto.</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-mist">
          Não é só categoria. O Cardinal organiza por vontade, impulso, aparência e chance real de valer o clique.
        </p>
      </div>

      <div className="mt-9 grid gap-4 lg:grid-cols-3">
        {rows.map((row) => (
          <div key={row.title} className="border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-signal">{row.eyebrow}</p>
            <h3 className="mt-2 font-display text-2xl font-black">{row.title}</h3>
            <div className="mt-5 space-y-3">
              {row.items.map(({ product, identity }) => (
                <Link
                  key={`${row.title}-${product.slug}`}
                  href={`/produto/${product.slug}`}
                  className="group grid grid-cols-[72px_1fr] gap-3 rounded-md border border-white/10 bg-void/35 p-2 transition hover:border-signal/40"
                >
                  <div className="aspect-square overflow-hidden rounded-sm">
                    <ProductArt product={product} className="h-full w-full" sizes="72px" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold">{identity.nickname}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-mist">{identity.whisper}</p>
                    <p className="mt-2 text-xs font-extrabold text-signal">{formatPrice(product)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
