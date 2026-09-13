import { dealTone, unknownPriceCallout, type Product } from "@/lib/products";

export default function DealPop({
  product,
  className = "",
  compact = false,
}: {
  product: Product;
  className?: string;
  compact?: boolean;
}) {
  const callout = unknownPriceCallout(product);
  if (!callout) return null;

  return (
    <span
      className={`deal-pop inline-flex max-w-full items-center gap-1.5 font-display font-extrabold leading-tight ${compact ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-2 text-xs"} ${className}`}
      data-tone={dealTone(product)}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
      <span className="truncate">{callout}</span>
    </span>
  );
}
