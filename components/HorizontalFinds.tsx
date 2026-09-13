"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";
import { usePrefersReducedMotion } from "@/hooks/useMotion";

export default function HorizontalFinds({ products }: { products: Product[] }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

  if (products.length < 4) return null;

  return (
    <>
      <section className="lg:hidden" aria-label="Coleção em movimento">
        <div className="px-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal">Campo</p>
          <h2 className="mt-3 font-display text-3xl font-black tracking-tight">Achados em deslocamento</h2>
        </div>
        <div className="mt-8 flex gap-5 overflow-x-auto px-4 pb-4 no-scrollbar">
          {products.map((product) => (
            <div key={product.slug} className="w-[240px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
      <section ref={ref} className="relative hidden lg:block" style={{ height: "180vh" }} aria-label="Coleção em movimento">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-[1400px] px-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal">Campo</p>
            <h2 className="mt-3 font-display text-5xl font-black tracking-tight">Achados em deslocamento</h2>
          </div>
          <motion.div style={reduced ? undefined : { x }} className="mt-12 flex gap-8 px-6">
            {products.map((product) => (
              <div key={product.slug} className="w-[320px] shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
