import Image from "next/image";
import { productImageUrl, type Product } from "@/lib/products";

export default function ProductArt({
  product,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw",
}: {
  product: Product;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#ece8e1] ${className}`}>
      <Image
        src={productImageUrl(product)}
        alt={product.name}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
    </div>
  );
}
