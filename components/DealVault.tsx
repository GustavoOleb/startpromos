import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

const spans = [
  "lg:col-span-6 lg:row-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-5",
  "lg:col-span-4",
];

export default function DealVault({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6" aria-labelledby="deal-vault">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal">Coleção</p>
      <h2 id="deal-vault" className="mt-3 font-display text-4xl font-black tracking-tight sm:text-6xl">
        Deal Vault
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12">
        {products.map((product, index) => (
          <div key={product.slug} className={spans[index % spans.length]}>
            <ProductCard product={product} featured={index % 5 === 0} />
          </div>
        ))}
      </div>
    </section>
  );
}
