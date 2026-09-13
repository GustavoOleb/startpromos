const STEPS = [
  { n: "01", title: "Cardinal observa", copy: "A IA acompanha produtos, imagens, preços e sinais que aparecem no mercado." },
  { n: "02", title: "Dados comparados", copy: "O Cardinal cruza preço atual, histórico, desconto e recência antes de destacar algo." },
  { n: "03", title: "Categoria nasce", copy: "Uma categoria só aparece no site quando já existe produto real publicado nela." },
  { n: "04", title: "Oferta aberta", copy: "Você confere a oferta na loja de origem e decide com o preço atual na tela." },
];

export default function RadarExplanation() {
  return (
    <section id="como-funciona" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-20 sm:px-6 lg:py-28">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal">Método</p>
      <h2 className="mt-3 max-w-2xl font-display text-4xl font-black tracking-tight sm:text-6xl">
        O radar lê o que importa.
      </h2>
      <ol className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <li key={step.n} className="bg-void p-6 sm:p-8">
            <p className="font-display text-4xl font-black text-white/15">{step.n}</p>
            <h3 className="mt-6 font-display text-2xl font-bold">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-mist">{step.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
