export const SITE = {
  name: "StartPromos",
  tagline: "Menos busca. Mais achado.",
  description:
    "Estação digital de descoberta de ofertas. Produtos encontrados, validados, comparados e organizados pelo Cardinal.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://startpromos.com.br",
} as const;

export const FOOTER_INFO = [
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/transparencia", label: "Transparência" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos" },
] as const;
