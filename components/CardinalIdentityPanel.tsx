import { getCardinalIdentity } from "@/lib/cardinal-identity";
import type { Product } from "@/lib/products";

export default function CardinalIdentityPanel({ product }: { product: Product }) {
  const identity = getCardinalIdentity(product);
  const dna = [
    ["Preço", identity.offerDna.preco],
    ["Aparência", identity.offerDna.aparencia],
    ["Confiança", identity.offerDna.confianca],
    ["Desejo", identity.offerDna.desejo],
  ] as const;

  return (
    <section className="cardinal-panel border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-signal">Instinto Cardinal</p>
          <h2 className="mt-2 font-display text-2xl font-black">{identity.commercialTitle}</h2>
          <p className="mt-2 text-sm text-mist">{identity.story}</p>
        </div>
        <div className="rounded-md border border-signal/30 bg-signal/10 px-3 py-2 text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-signal">Temperatura</p>
          <p className="font-display text-xl font-black">{identity.temperatureLabel}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {dna.map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-mist">
              <span>{label}</span>
              <span>{value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-signal" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric label="Dopamina" value={identity.dopamineScore} />
        <Metric label="Impulso" value={identity.impulseScore} />
        <Metric label="Confiança" value={identity.confidence} />
      </div>

      <p className="mt-5 text-sm font-semibold text-fog">{identity.verdict}</p>
      <p className="mt-2 text-sm text-mist">{identity.imaginedUse}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {identity.badges.map((badge) => (
          <span key={badge} className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-xs font-semibold text-mist">
            {badge}
          </span>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-white/10 bg-void/35 p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-mute">{label}</p>
      <p className="mt-1 font-display text-2xl font-black">{value}</p>
    </div>
  );
}
