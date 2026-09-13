"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getPublishedProducts } from "@/lib/products";
import { suggestCatalog } from "@/lib/search";
import { formatPrice } from "@/lib/products";

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const catalog = useMemo(() => getPublishedProducts(), []);

  const suggestions = useMemo(() => (query.trim().length ? suggestCatalog(catalog, query) : catalog.slice(0, 5)), [catalog, query]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, [open]);

  if (!open) return null;

  function go(path: string) {
    setLoading(true);
    router.push(path);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-24" role="dialog" aria-modal="true" aria-label="Busca">
      <button type="button" className="absolute inset-0" aria-label="Fechar busca" onClick={onClose} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-graphite shadow-2xl">
        <form
          className="flex items-center gap-3 border-b border-white/10 px-4"
          onSubmit={(event) => {
            event.preventDefault();
            go(query.trim() ? `/ofertas?q=${encodeURIComponent(query.trim())}` : "/ofertas");
          }}
        >
          <Search className="h-4 w-4 text-mute" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nome, marca, categoria..."
            className="h-14 w-full bg-transparent text-base text-fog placeholder:text-mute focus:outline-none"
            aria-label="Buscar ofertas"
            autoComplete="off"
          />
          {loading && <span className="text-xs text-mute">Buscando...</span>}
        </form>
        <ul className="max-h-80 overflow-auto p-2">
          {suggestions.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-mute">Nenhum achado para essa busca.</li>
          ) : (
            suggestions.map((product) => (
              <li key={product.slug}>
                <Link
                  href={`/produto/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 hover:bg-white/5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-fog">{product.name}</span>
                    <span className="text-xs text-mute">
                      {product.brand} · {product.subcategory}
                    </span>
                  </span>
                  <span className="shrink-0 font-display text-sm font-bold">{formatPrice(product)}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
