"use client";

import { getPublishedProducts } from "@/lib/products";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/hooks/useFavorites";

export default function SavedFinds() {
  const { slugs } = useFavorites();
  const items = getPublishedProducts().filter((product) => slugs.includes(product.slug));

  if (!items.length) {
    return (
      <EmptyState
        title="Nenhum achado salvo"
        copy="Toque no marcador de um produto para guardar localmente. Sem conta, sem login."
        href="/ofertas"
        cta="Explorar ofertas"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
