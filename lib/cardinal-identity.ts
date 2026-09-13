import { discountPct, type Product } from "@/lib/products";

export type CardinalIdentity = {
  nickname: string;
  temperature: "frio" | "morno" | "quente" | "absurdo";
  temperatureLabel: string;
  impulseScore: number;
  dopamineScore: number;
  confidence: "Alta" | "Boa" | "Em busca";
  verdict: string;
  whisper: string;
  commercialTitle: string;
  story: string;
  imaginedUse: string;
  mood: "street" | "limpo" | "treino" | "casa" | "tech" | "presente" | "luxo";
  personality: string[];
  offerDna: {
    preco: number;
    aparencia: number;
    confianca: number;
    desejo: number;
  };
  badges: string[];
  garimpoState: string;
  instinct: "publicar" | "buscar mais" | "bom para hero" | "trocar imagem";
};

const titleWords = new Set(["kit", "polo", "camiseta", "camisa", "relogio", "chinelo", "jaqueta", "calca", "short", "vestido", "furadeira", "panela"]);

function textOf(product: Product) {
  return `${product.name} ${product.subcategory} ${product.category} ${product.tags.join(" ")}`.toLowerCase();
}

function hasAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function cleanToken(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function detectMood(product: Product, text: string): CardinalIdentity["mood"] {
  if (product.category === "tech" || hasAny(text, ["relogio", "furadeira", "parafusadeira", "fone", "gadget"])) return "tech";
  if (product.category === "casa" || hasAny(text, ["panela", "casa", "tempero", "lencol", "churrasqueira"])) return "casa";
  if (hasAny(text, ["academia", "fitness", "dry fit", "treino", "creatina"])) return "treino";
  if (hasAny(text, ["strass", "olevs", "luxo", "premium", "scarface", "country"])) return "luxo";
  if (hasAny(text, ["kit", "relogio", "presente", "unissex"])) return "presente";
  if (hasAny(text, ["street", "oversized", "baggy", "rapper", "anime", "jujutsu"])) return "street";
  return "limpo";
}

function nickname(product: Product, mood: CardinalIdentity["mood"], text: string) {
  if (hasAny(text, ["polo"])) return "a polo limpa";
  if (hasAny(text, ["relogio"])) return "o relógio presença";
  if (hasAny(text, ["kit"])) return "o kit que resolve";
  if (hasAny(text, ["chinelo", "slide", "babuche"])) return "o conforto fácil";
  if (hasAny(text, ["furadeira", "parafusadeira"])) return "a ferramenta séria";
  if (hasAny(text, ["jaqueta", "puffer"])) return "a peça de impacto";
  if (mood === "casa") return "o achado útil";
  if (mood === "treino") return "o treino sem enrolação";
  if (mood === "luxo") return "o luxo acessível";
  return "o achado abrível";
}

function commercialTitle(product: Product, mood: CardinalIdentity["mood"], text: string) {
  if (hasAny(text, ["polo"])) return "Polo com cara premium";
  if (hasAny(text, ["kit", "camiseta"])) return "Básico que salva o armário";
  if (hasAny(text, ["relogio"])) return "Relógio com presença de peça cara";
  if (hasAny(text, ["chinelo", "slide", "babuche"])) return "Conforto barato de abrir agora";
  if (hasAny(text, ["furadeira", "parafusadeira", "esmerilhadeira"])) return "Ferramenta que parece achado sério";
  if (mood === "casa") return "Útil de casa com preço de garimpo";
  if (mood === "treino") return "Peça de treino para usar muito";
  if (mood === "street") return "Streetwear com clique fácil";
  return product.name.length > 64 ? "Produto bom escondido em nome gigante" : product.name;
}

function imaginedUse(product: Product, mood: CardinalIdentity["mood"], text: string) {
  if (mood === "street") return "Combina com jeans largo, tênis limpo e visual de rua sem esforço.";
  if (mood === "limpo") return "Funciona com jeans claro, tênis branco e relógio simples.";
  if (mood === "treino") return "Boa para treino, faculdade e rotina em que conforto precisa aguentar o dia.";
  if (mood === "casa") return "Entra na rotina sem parecer compra aleatória: útil, simples e fácil de justificar.";
  if (mood === "tech") return "Tem presença de item mais caro e chama atenção rápido na vitrine.";
  if (mood === "luxo") return "Serve para elevar o visual sem depender de peça cara.";
  if (hasAny(text, ["presente", "kit", "relogio"])) return "Tem cara de presente rápido quando você quer acertar sem pensar demais.";
  return `${product.subcategory} com apelo direto para abrir e conferir.`;
}

function story(product: Product, mood: CardinalIdentity["mood"], text: string) {
  if (product.price === 0) return "Encontrado em estado bruto: imagem boa, link válido e preço ainda em caça pelo Cardinal.";
  if (discountPct(product) >= 25) return "O preço caiu o bastante para virar destaque, não só mais um item na vitrine.";
  if (mood === "luxo") return "Parece mais caro do que deveria, que é exatamente o tipo de distorção que o Cardinal caça.";
  if (hasAny(text, ["kit"])) return "Kit bom resolve volume: mais peças, menos decisão e sensação clara de vantagem.";
  return "Achado com sinais bons de imagem, categoria e abertura rápida para conferir o preço atual.";
}

export function getCardinalIdentity(product: Product): CardinalIdentity {
  const text = textOf(product);
  const normalized = cleanToken(text);
  const discount = discountPct(product);
  const priceSignal = product.price === 0 ? 64 : Math.max(45, Math.min(99, 55 + discount + (product.oldPrice ? 8 : 0)));
  const imageSignal = product.image.includes("thumbnail_900") || product.image.includes("800:800") ? 88 : 74;
  const proofSignal = product.ratingCount ? Math.min(99, 70 + Math.round(product.ratingCount / 8)) : product.salesCount ? 84 : 58;
  const desireBoost = hasAny(normalized, ["premium", "luxo", "kit", "streetwear", "oversized", "olevs", "strass", "algodao"]) ? 12 : 0;
  const dopamineScore = Math.min(99, Math.round((priceSignal + imageSignal + proofSignal) / 3) + desireBoost);
  const impulseScore = Math.min(99, dopamineScore + (product.price === 0 ? 8 : 0) + (discount >= 25 ? 6 : 0));
  const mood = detectMood(product, text);
  const temperature =
    impulseScore >= 90 ? "absurdo" :
    impulseScore >= 78 ? "quente" :
    impulseScore >= 62 ? "morno" :
    "frio";
  const confidence = product.price > 0 && product.image ? "Alta" : product.image ? "Boa" : "Em busca";
  const nameIsMessy = product.name.length > 86 || product.name.split(" ").length > 13;
  const badges = [
    "Abrível",
    imageSignal >= 82 ? "Foto convence" : "Imagem ok",
    nameIsMessy ? "Nome feio, produto bom" : "Vitrine pronta",
    hasAny(normalized, ["kit", "relogio", "presente", "unissex", "olevs"]) ? "Presenteável" : null,
    product.price === 0 ? "Oferta em estado bruto" : null,
    product.price > 0 && discount >= 20 ? "Coisa que parece cara" : null,
    impulseScore >= 82 ? "Radar de arrependimento" : null,
  ].filter(Boolean) as string[];
  const knownWords = product.name
    .split(/\s+/)
    .map(cleanToken)
    .filter((word) => titleWords.has(word));
  const veredictAction = impulseScore >= 82 ? "abre agora" : product.price === 0 ? "abre para conferir" : "vale olhar";

  return {
    nickname: nickname(product, mood, text),
    temperature,
    temperatureLabel: temperature === "absurdo" ? "Absurdo" : temperature === "quente" ? "Quente" : temperature === "morno" ? "Morno" : "Frio",
    impulseScore,
    dopamineScore,
    confidence,
    verdict: `Veredito: ${veredictAction}. ${product.price === 0 ? "Preço em busca, mas imagem e link já passaram." : "Preço, imagem e contexto fazem sentido."}`,
    whisper: impulseScore >= 84 ? "esse aqui dá vontade de abrir sem pensar muito" : product.price === 0 ? "imagem boa, preço ainda sendo caçado" : "não é só barato, parece usável",
    commercialTitle: commercialTitle(product, mood, text),
    story: story(product, mood, text),
    imaginedUse: imaginedUse(product, mood, text),
    mood,
    personality: [
      mood,
      product.price === 0 ? "preço em busca" : "preço visto",
      knownWords[0] ?? product.subcategory.toLowerCase(),
      impulseScore >= 82 ? "impulso alto" : "garimpo sólido",
    ],
    offerDna: {
      preco: priceSignal,
      aparencia: imageSignal,
      confianca: confidence === "Alta" ? 92 : confidence === "Boa" ? 76 : 58,
      desejo: Math.min(99, dopamineScore + 4),
    },
    badges,
    garimpoState: product.price === 0 ? "Garimpo cru" : discount >= 20 ? "Oferta lapidada" : "Oferta sem enrolação",
    instinct: impulseScore >= 88 ? "bom para hero" : product.price === 0 ? "buscar mais" : imageSignal < 70 ? "trocar imagem" : "publicar",
  };
}
