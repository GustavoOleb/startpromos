import { getPrimarySignal } from "@/lib/signals";
import { getPublishedProducts } from "@/lib/products";
import { formatPrice } from "@/lib/products";

export default function SignalTicker() {
  const products = getPublishedProducts();
  const items = products.map((product) => {
    const signal = getPrimarySignal(product);
    return `${signal.label} · ${product.brand} · ${formatPrice(product)}`;
  });
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-white/10 py-3" aria-hidden>
      <div className="ticker-track flex w-max gap-10 whitespace-nowrap px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-3">
            <span className="h-1 w-1 rounded-full bg-signal" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
