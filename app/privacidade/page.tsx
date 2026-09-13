import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Privacidade na StartPromos.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl font-black">Privacidade</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-mist">
        <p>Favoritos ficam apenas no seu navegador, via armazenamento local.</p>
        <p>Não exigimos conta para explorar ou salvar achados.</p>
        <p>Buscas acontecem neste site. Cliques em ofertas levam à loja de origem, que possui a própria política.</p>
      </div>
    </div>
  );
}
