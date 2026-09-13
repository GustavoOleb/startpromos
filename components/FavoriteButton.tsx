"use client";

import { Bookmark } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoriteButton({
  slug,
  name,
  className = "",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const { has, toggle } = useFavorites();
  const saved = has(slug);

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={saved}
      aria-label={saved ? `Remover ${name} dos achados` : `Salvar ${name}`}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 text-mist transition-colors hover:border-signal/50 hover:text-signal ${
        saved ? "border-signal/40 bg-signal/10 text-signal" : ""
      } ${className}`}
    >
      <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
