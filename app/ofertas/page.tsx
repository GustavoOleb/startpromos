import type { Metadata } from "next";
import { Suspense } from "react";
import OfferExplorer from "@/components/OfferExplorer";
import { getPublishedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ofertas",
  description: "Campo de ofertas da StartPromos, com busca, sinais e filtros.",
  alternates: { canonical: "/ofertas" },
};

export default function OfertasPage() {
  const catalog = getPublishedProducts();
  return (
    <Suspense fallback={<div className="px-6 py-20 text-mute">Lendo o campo...</div>}>
      <OfferExplorer products={catalog} heading="Ofertas" />
    </Suspense>
  );
}
