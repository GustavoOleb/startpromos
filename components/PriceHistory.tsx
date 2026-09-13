import { formatBRL, formatPrice, hasUsableHistory, lowestObserved, type Product } from "@/lib/products";

export default function PriceHistory({ product }: { product: Product }) {
  if (!hasUsableHistory(product)) {
    return (
      <div className="border border-white/10 p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-signal">Histórico</p>
        <p className="mt-3 text-sm text-mist">Histórico limitado. Ainda não há série suficiente para um gráfico.</p>
      </div>
    );
  }

  const history = product.priceHistory;
  const width = 520;
  const height = 160;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const step = width / (history.length - 1);
  const points = history.map((value, index) => {
    const x = index * step;
    const y = height - ((value - min) / range) * (height - 16) - 8;
    return `${x},${y}`;
  });
  const low = lowestObserved(product);

  return (
    <div className="border border-white/10 p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-signal">Histórico observado</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-6 h-40 w-full" role="img" aria-label="Variação de preço observada">
        <polyline points={points.join(" ")} fill="none" stroke="#ff5a1f" strokeWidth="2.5" />
      </svg>
      <dl className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="text-mute">Atual</dt>
          <dd className="font-display text-lg font-bold">{formatPrice(product)}</dd>
        </div>
        <div>
          <dt className="text-mute">Menor observado</dt>
          <dd className="font-display text-lg font-bold">{low ? formatBRL(low) : "—"}</dd>
        </div>
        <div>
          <dt className="text-mute">Anterior</dt>
          <dd className="font-display text-lg font-bold">
            {product.oldPrice ? formatBRL(product.oldPrice) : "Informação não disponível"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
