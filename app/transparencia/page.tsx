import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparência",
  description: "Como a StartPromos trata dados de ofertas.",
  alternates: { canonical: "/transparencia" },
};

export default function TransparenciaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl font-black">Transparência</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-mist">
        <p>A StartPromos não vende produtos e não processa pagamentos.</p>
        <p>O botão “Ver oferta” abre a loja de origem para você conferir o preço atual.</p>
        <p>Não inventamos preço, desconto, estoque, avaliação ou histórico. Se o dado não existe, ele não aparece.</p>
        <p>O Cardinal só destaca uma categoria quando já existe produto real publicado nela.</p>
      </div>
    </div>
  );
}
