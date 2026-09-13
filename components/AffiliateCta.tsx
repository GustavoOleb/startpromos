import { ArrowUpRight } from "lucide-react";

export default function AffiliateCta({
  href,
  label = "Ver oferta",
  className = "",
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-signal px-6 font-display text-sm font-extrabold text-void transition-transform hover:bg-[#ff7a3d] active:scale-[0.99] ${className}`}
      >
        {label}
        <ArrowUpRight className="h-4 w-4" />
      </a>
      <p className="mt-2 text-center text-xs text-mute">Abrimos a oferta na loja para você conferir o preço atual.</p>
    </div>
  );
}
