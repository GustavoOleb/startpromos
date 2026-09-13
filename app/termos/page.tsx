import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos",
  description: "Termos de uso da StartPromos.",
  alternates: { canonical: "/termos" },
};

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl font-black">Termos</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-mist">
        <p>A StartPromos é uma plataforma de descoberta. Preços e disponibilidade podem mudar na loja de destino.</p>
        <p>Não somos marketplace. A compra, o envio e o suporte da transação são da loja de origem.</p>
        <p>O conteúdo publicado reflete a curadoria e os dados disponíveis no momento da verificação.</p>
      </div>
    </div>
  );
}
