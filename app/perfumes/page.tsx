import type { Metadata } from "next";
import { getPublishedByCategory } from "@/lib/products";
import OfferExplorer from "@/components/OfferExplorer";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Perfumes",
  description: "Perfumes selecionados pela StartPromos. Sem achados inventados.",
  alternates: { canonical: "/perfumes" },
};

export default function PerfumesPage() {
  const items = getPublishedByCategory("perfumes");
  if (!items.length) notFound();

  return (
    <>
      <section className="relative mx-auto max-w-[1400px] overflow-hidden px-4 pb-6 pt-12 sm:px-6">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-signal/10 blur-3xl" />
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal">Categoria 04</p>
        <h1 className="mt-4 max-w-[8ch] font-display text-6xl font-black tracking-tight sm:text-8xl">Perfumes</h1>
        <p className="mt-6 max-w-lg text-mist">
          Esta faixa está em varredura. Não publicamos fragrâncias sem link, preço e verificação reais.
        </p>
      </section>
      <Suspense fallback={<div className="px-6 py-10 text-mute">Carregando...</div>}>
        <OfferExplorer products={items} heading="Perfumes" />
      </Suspense>
    </>
  );
}
