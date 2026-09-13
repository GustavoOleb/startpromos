"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Star } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";

export default function PurchaseToasts({ products }: { products: Product[] }) {
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const stream = useMemo(() => products.slice(0, 8), [products]);

  useEffect(() => {
    if (pathname.startsWith("/dashadmin") || stream.length === 0) return;
    const show = window.setInterval(() => {
      setIndex((current) => (current + 1) % stream.length);
      setVisible(true);
      window.setTimeout(() => setVisible(false), 4600);
    }, 12000);
    return () => window.clearInterval(show);
  }, [pathname, stream.length]);

  if (pathname.startsWith("/dashadmin") || stream.length === 0 || !visible) return null;

  const product = stream[index];

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-20 left-4 z-50 max-w-[calc(100vw-2rem)] rounded-lg border border-white/10 bg-void/92 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:bottom-4 sm:max-w-sm"
    >
      <div className="flex gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-signal text-void">
          <ShoppingBag className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-signal">
            <Star className="h-3.5 w-3.5" />
            alguém acabou de olhar
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold text-fog">{product.name}</p>
          <p className="mt-1 text-sm font-extrabold text-white">{formatPrice(product)}</p>
        </div>
      </div>
    </aside>
  );
}
