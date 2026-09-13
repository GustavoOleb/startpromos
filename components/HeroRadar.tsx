"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { discountPct, formatBRL, formatPrice, savings, socialProof, type Product } from "@/lib/products";
import ProductArt from "@/components/ProductArt";
import SignalBadge from "@/components/SignalBadge";
import DealPop from "@/components/DealPop";
import { getCardinalIdentity } from "@/lib/cardinal-identity";
import { usePrefersReducedMotion } from "@/hooks/useMotion";
import { getPrimarySignal } from "@/lib/signals";

const marks = ["INSTINTO", "DOPAMINA", "ABRÍVEL", "FOTO CONVENCE", "GARIMPO CRU", "ANTI-ARREPENDIMENTO"];

export default function HeroRadar({ products }: { products: Product[] }) {
  const reduced = usePrefersReducedMotion();
  const layer = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 40, damping: 18 });
  const sy = useSpring(y, { stiffness: 40, damping: 18 });
  const catalog = products;
  const ranked = [...catalog].sort((a, b) => discountPct(b) - discountPct(a) || a.foundMinutesAgo - b.foundMinutesAgo);
  const spotlight = ranked.find((product) => product.price === 0) ?? ranked[0];
  const orbit = ranked.filter((product) => product.slug !== spotlight?.slug).slice(0, 3);
  const spotlightSignal = spotlight ? getPrimarySignal(spotlight) : null;
  const spotlightDiscount = spotlight ? discountPct(spotlight) : 0;
  const spotlightProof = spotlight ? socialProof(spotlight) : [];
  const spotlightIdentity = spotlight ? getCardinalIdentity(spotlight) : null;

  function onMove(event: MouseEvent<HTMLElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(px * 18);
    y.set(py * 12);
  }

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className="radar-grid pointer-events-none absolute inset-0" />
      <div className="noise pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute right-[-10%] top-[8%] hidden h-[520px] w-[520px] lg:block" ref={layer}>
        <motion.div style={reduced ? undefined : { x: sx, y: sy }} className="relative h-full w-full">
          <svg viewBox="0 0 520 520" className="h-full w-full text-white/15" aria-hidden>
            <circle cx="260" cy="260" r="240" fill="none" stroke="currentColor" />
            <circle cx="260" cy="260" r="170" fill="none" stroke="currentColor" />
            <circle cx="260" cy="260" r="96" fill="none" stroke="currentColor" />
            <line x1="260" y1="20" x2="260" y2="500" stroke="currentColor" />
            <line x1="20" y1="260" x2="500" y2="260" stroke="currentColor" />
            <g className={reduced ? "" : "radar-sweep"}>
              <path d="M260 260 L260 20 A240 240 0 0 1 430 110 Z" fill="url(#sweep)" opacity="0.55" />
            </g>
            <defs>
              <linearGradient id="sweep" x1="260" y1="20" x2="400" y2="200">
                <stop offset="0" stopColor="#ff5a1f" stopOpacity="0.35" />
                <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx="318" cy="148" r="4" fill="#ff5a1f" className="live-dot" />
            <circle cx="168" cy="312" r="3" fill="#ff5a1f" className="live-dot" />
            <circle cx="372" cy="286" r="3.5" fill="#ffffff" opacity="0.5" />
          </svg>
          {orbit.map((product, index) => (
            <div
              key={product.slug}
              className={`absolute overflow-hidden border border-white/10 ${reduced ? "" : "float-slow"}`}
              style={{
                width: index === 0 ? 148 : 96,
                height: index === 0 ? 186 : 120,
                left: index === 0 ? "58%" : index === 1 ? "12%" : "72%",
                top: index === 0 ? "22%" : index === 1 ? "58%" : "62%",
                animationDelay: `${index * 0.6}s`,
              }}
            >
              <ProductArt product={product} className="h-full w-full" priority={index === 0} sizes="160px" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] items-end gap-8 px-4 pb-10 pt-20 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.58fr)] lg:items-center lg:pb-10 lg:pt-6">
        <div className="order-last lg:order-none">
          <p className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-signal">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-signal" />
            Estação de melhores preços
          </p>
          <h1 className="max-w-[11ch] font-display text-[18vw] font-black leading-[0.8] tracking-tight sm:text-[12vw] lg:text-[7.8rem]">
            Menos busca.
            <br />
            Mais achado.
          </h1>
          <p className="mt-8 max-w-md text-base leading-7 text-mist sm:text-lg">
            Ofertas encontradas, comparadas e organizadas pelo Cardinal por preço, aparência, desejo e chance real de valer o clique.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/ofertas"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-signal px-6 font-display text-sm font-extrabold text-void transition-transform hover:scale-[1.02]"
            >
              Explorar ofertas
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-fog hover:border-signal/60"
            >
              Como funciona
            </Link>
          </div>
          <ul className="mt-10 hidden flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-white/25 sm:flex">
            {marks.map((mark) => (
              <li key={mark}>{mark}</li>
            ))}
          </ul>
        </div>
        {spotlight && (
          <motion.aside
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hero-offer-card group relative order-first max-h-[calc(100svh-5.5rem)] overflow-hidden border border-white/10 bg-graphite/70 p-3 shadow-2xl backdrop-blur-xl lg:order-none lg:max-h-[calc(100svh-6.5rem)]"
          >
            <Link href={`/produto/${spotlight.slug}`} className="block">
              <div className="relative h-[min(52svh,560px)] min-h-[300px] overflow-hidden sm:min-h-[340px] lg:h-[min(58svh,560px)] lg:min-h-[360px]">
                <ProductArt product={spotlight} className="h-full w-full" priority sizes="(max-width: 1024px) 100vw, 440px" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/70 to-transparent p-4 sm:p-5">
                  {spotlightSignal && <SignalBadge signal={spotlightSignal} />}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-signal">Oferta imperdível agora</p>
                    {spotlightIdentity && (
                      <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-fog">
                        {spotlightIdentity.temperatureLabel}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 line-clamp-2 font-display text-xl font-black leading-tight sm:text-2xl">
                    {spotlightIdentity?.commercialTitle ?? spotlight.name}
                  </h2>
                  {spotlightIdentity && <p className="mt-1 line-clamp-2 text-xs font-semibold text-mist">Cardinal: {spotlightIdentity.whisper}</p>}
                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <p className="font-display text-3xl font-extrabold sm:text-4xl">{formatPrice(spotlight)}</p>
                    {spotlight.oldPrice && <p className="text-sm text-mute line-through">{formatBRL(spotlight.oldPrice)}</p>}
                  </div>
                  <DealPop product={spotlight} className="mt-2" />
                  {spotlight.price > 0 && spotlightDiscount > 0 && (
                    <p className="mt-1 text-sm text-good">Economia {formatBRL(savings(spotlight))} · -{spotlightDiscount}%</p>
                  )}
                  {spotlightProof.length > 0 && <p className="mt-2 text-xs text-mist">{spotlightProof.join(" · ")}</p>}
                  {spotlightIdentity && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-mist">
                      <span>Dopamina {spotlightIdentity.dopamineScore}</span>
                      <span>Impulso {spotlightIdentity.impulseScore}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
            <a
              href={spotlight.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-signal px-5 font-display text-sm font-extrabold text-void transition-transform hover:scale-[1.01]"
            >
              Pegar oferta
            </a>
          </motion.aside>
        )}
      </div>
    </section>
  );
}
