"use client";

import { useEffect, useId, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { getActiveCategories, type Product } from "@/lib/products";
import { filterOffers, normalizeCategory, type SortKey } from "@/lib/search";
import type { SignalKind } from "@/lib/signals";

const SIGNALS: { id: SignalKind | "all"; label: string }[] = [
  { id: "all", label: "Todos os sinais" },
  { id: "price-drop", label: "Queda detectada" },
  { id: "lowest-observed", label: "Menor preço" },
  { id: "interesting-price", label: "Preço interessante" },
  { id: "new-find", label: "Novo achado" },
  { id: "limited-history", label: "Histórico limitado" },
];

export default function OfferExplorer({
  products,
  heading,
}: {
  products: Product[];
  heading: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const category = normalizeCategory(params.get("cat"));
  const sort = (params.get("sort") as SortKey) || "relevance";
  const signal = (params.get("signal") as SignalKind | "all") || "all";
  const minDiscount = Number(params.get("desc") ?? "0") || 0;
  const [draft, setDraft] = useState(query);
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const searchValue = draft;
  const activeCategories = getActiveCategories();

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all" || value === "0") next.delete(key);
    else next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const filtered = filterOffers(products, { query, category, sort, signal, minDiscount });

  const controls = (
    <div className="flex flex-col gap-4">
      <label className="text-xs uppercase tracking-[0.16em] text-mute">
        Ordenar
        <select
          value={sort}
          onChange={(event) => setParam("sort", event.target.value)}
          className="mt-2 block w-full rounded-full border border-white/10 bg-graphite px-4 py-3 text-sm text-fog"
        >
          <option value="relevance">Relevância</option>
          <option value="discount">Maior desconto</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="recent">Mais recentes</option>
        </select>
      </label>
      <label className="text-xs uppercase tracking-[0.16em] text-mute">
        Categoria
        <select
          value={category}
          onChange={(event) => setParam("cat", event.target.value)}
          className="mt-2 block w-full rounded-full border border-white/10 bg-graphite px-4 py-3 text-sm text-fog"
        >
          <option value="all">Todas</option>
          {activeCategories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs uppercase tracking-[0.16em] text-mute">
        Sinal
        <select
          value={signal}
          onChange={(event) => setParam("signal", event.target.value)}
          className="mt-2 block w-full rounded-full border border-white/10 bg-graphite px-4 py-3 text-sm text-fog"
        >
          {SIGNALS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs uppercase tracking-[0.16em] text-mute">
        Desconto mínimo
        <select
          value={String(minDiscount)}
          onChange={(event) => setParam("desc", event.target.value)}
          className="mt-2 block w-full rounded-full border border-white/10 bg-graphite px-4 py-3 text-sm text-fog"
        >
          <option value="0">Qualquer</option>
          <option value="10">10%+</option>
          <option value="20">20%+</option>
          <option value="30">30%+</option>
        </select>
      </label>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal">{heading}</p>
      <h1 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-6xl">
        {query ? `Achados para “${query}”` : "Campo de ofertas"}
      </h1>
      <form
        className="mt-8 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setParam("q", draft.trim());
        }}
      >
        <input
          value={searchValue}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Buscar nome, marca, tag..."
          className="h-12 min-w-0 flex-1 rounded-full border border-white/10 bg-graphite px-5 text-sm"
          aria-label="Buscar ofertas"
        />
        <button type="submit" className="h-12 rounded-full bg-signal px-5 font-display text-sm font-bold text-void">
          Buscar
        </button>
      </form>

      <div className="mt-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="hidden lg:block">{controls}</aside>
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-mute">{filtered.length} achados</p>
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm lg:hidden"
              onClick={() => setOpen(true)}
              aria-expanded={open}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </button>
          </div>
          {filtered.length ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhum sinal nessa faixa" copy="Tente outro termo ou limpe os filtros. O radar só mostra o que realmente existe no catálogo." />
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <button type="button" className="absolute inset-0 bg-black/70" aria-label="Fechar filtros" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-auto rounded-t-3xl bg-graphite p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 id={titleId} className="font-display text-xl font-bold">
                Filtros
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="min-h-11 min-w-11" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>
            {controls}
            <button
              type="button"
              className="mt-6 h-12 w-full rounded-full bg-signal font-display text-sm font-bold text-void"
              onClick={() => setOpen(false)}
            >
              Ver resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
