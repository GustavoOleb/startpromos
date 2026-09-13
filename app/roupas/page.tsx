import type { Metadata } from "next";
import { Suspense } from "react";
import OfferExplorer from "@/components/OfferExplorer";
import { getPublishedByCategory } from "@/lib/products";
import ProductArt from "@/components/ProductArt";

export const metadata: Metadata = {
  title: "Roupas",
  description: "Achados de roupas curados pela StartPromos.",
  alternates: { canonical: "/roupas" },
};

export default function RoupasPage() {
  const items = getPublishedByCategory("roupas");
  const hero = items[0];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1400px] items-end gap-8 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-2 lg:pt-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal">Categoria 03</p>
            <h1 className="mt-4 font-display text-6xl font-black tracking-tight sm:text-8xl">Roupas</h1>
            <p className="mt-6 max-w-md text-mist">
              Peças de rua, polo, denim e oversized. Poucas categorias. Só o que entrou no radar.
            </p>
          </div>
          {hero && (
            <div className="relative aspect-[4/5] max-h-[520px] overflow-hidden">
              <ProductArt product={hero} className="h-full w-full" priority sizes="50vw" />
            </div>
          )}
        </div>
      </section>
      <Suspense fallback={<div className="px-6 py-10 text-mute">Carregando peças...</div>}>
        <OfferExplorer products={items} heading="Roupas no radar" />
      </Suspense>
    </>
  );
}
