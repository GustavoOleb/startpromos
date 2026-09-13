"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButton({
  url,
  title,
  className = "",
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch {
        // Fallback to copy if user cancels or it fails
      }
    }
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Compartilhar oferta"
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 text-mist transition-colors hover:border-fog/50 hover:text-fog ${className}`}
      title={copied ? "Link copiado!" : "Compartilhar"}
    >
      {copied ? <Check className="h-4 w-4 text-good" /> : <Share2 className="h-4 w-4" />}
    </button>
  );
}
