import { isAllowedAffiliateUrl } from "./affiliate-networks.ts";

export type Category = "roupas" | "perfumes" | "beleza" | "calcados" | "casa" | "tech";

export type StoreOffer = {
  store: string;
  price: number;
  isBest?: boolean;
  affiliateReady?: boolean;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  subcategory: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  ratingCount?: number;
  salesCount?: number;
  image: string;
  affiliateUrl: string;
  palette: [string, string];
  offers: StoreOffer[];
  priceHistory: number[];
  foundMinutesAgo: number;
  tags: string[];
  description: string;
  source?: string;
  lastVerifiedAt?: string;
  network?: "shein" | "shopee" | "tiktok-shop";
  status?: "published" | "draft";
};

function bestOffer(offers: StoreOffer[]): StoreOffer[] {
  const min = Math.min(...offers.map((o) => o.price));
  return offers.map((o) => ({ ...o, isBest: o.price === min }));
}

function tiktokProduct({
  slug,
  name,
  category,
  subcategory,
  image,
  affiliateUrl,
  foundMinutesAgo,
  tags,
  description,
  palette = ["#1f1b18", "#ff8a3d"],
}: Pick<Product, "slug" | "name" | "category" | "subcategory" | "image" | "affiliateUrl" | "foundMinutesAgo" | "tags" | "description"> & {
  palette?: [string, string];
}): Product {
  return {
    slug,
    name,
    category,
    subcategory,
    brand: "TikTok Shop",
    price: 0,
    image,
    affiliateUrl,
    palette,
    offers: bestOffer([{ store: "TikTok Shop", price: 0, affiliateReady: true }]),
    priceHistory: [],
    foundMinutesAgo,
    tags,
    description,
    source: affiliateUrl,
    lastVerifiedAt: "2026-09-12T21:47:00.000Z",
    network: "tiktok-shop",
    status: "published",
  };
}

export const products: Product[] = [
  { slug: "romwe-men-calca-denim-estampada", name: "ROMWE MEN Street Life Calça Denim Casual Estampada Masculina", category: "roupas", subcategory: "Calças masculinas", brand: "ROMWE MEN", price: 274.72, oldPrice: 330.99, rating: 4.7, ratingCount: 100, image: "https://img.ltwebstatic.com/v4/j/pi/2025/10/21/8f/176104641302b28886acec0fdab5cd085b5f5e5ff6_thumbnail_900x.webp", affiliateUrl: "https://onelink.shein.com/52/61ssfuc18igi?ismg_ol=GPnzWT6d7BX_01_KOC-C", palette: ["#d8d2c8", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 274.72, affiliateReady: true }]), priceHistory: [330.99, 315.9, 299.9, 289.9, 274.72], foundMinutesAgo: 4, tags: ["denim", "streetwear", "masculino"], description: "Calça jeans masculina com estampa gráfica, estética street e modelagem casual." },
  { slug: "pavtros-shorts-camuflado-realtree", name: "PAVTROS Shorts de Malha com Cordão e Estampa Camuflada REALTREE", category: "roupas", subcategory: "Shorts", brand: "PAVTROS", price: 79.07, oldPrice: 112.95, rating: 4.74, ratingCount: 78, image: "https://img.ltwebstatic.com/v4/j/pi/2026/04/29/c5/1777426937afb64a1598522da12460184709f4c87b_thumbnail_900x.webp", affiliateUrl: "https://onelink.shein.com/52/61sseb361kie?ismg_ol=Cbn3Q56cxTs_01_KOC-C", palette: ["#627052", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 79.07, affiliateReady: true }]), priceHistory: [112.95, 99.9, 89.9, 79.07], foundMinutesAgo: 8, tags: ["camuflado", "confortável", "unissex"], description: "Shorts utilitários de malha com cintura elástica e cordão, para rua e atividades ao ar livre." },
  { slug: "manfinity-campus-court-jaqueta", name: "Manfinity Campus Court Jaqueta Casual com Zíper e Contraste", category: "roupas", subcategory: "Jaquetas", brand: "Manfinity", price: 101.21, oldPrice: 134.95, rating: 4.7, ratingCount: 100, image: "https://img.ltwebstatic.com/v4/j/pi/2025/10/30/e7/17617948366c2b4563e650b033057a0efe6aedc10d_thumbnail_900x.webp", affiliateUrl: "https://onelink.shein.com/52/61ssd3ohlrmy?ismg_ol=ANIQq4ZAf8g_01_KOC-C", palette: ["#a89bc5", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 101.21, affiliateReady: true }]), priceHistory: [134.95, 124.9, 114.9, 101.21], foundMinutesAgo: 12, tags: ["jaqueta", "casual", "contraste"], description: "Jaqueta casual de manga longa com zíper frontal, caimento solto e contraste de cores." },
  { slug: "cinto-porcelana-azul-branco", name: "Cinto Unissex Vintage com Padrão de Porcelana Azul e Branco", category: "roupas", subcategory: "Acessórios", brand: "SHEIN", price: 31.97, oldPrice: 40.95, rating: 4.69, ratingCount: 26, image: "https://img.ltwebstatic.com/v4/j/spmp/2026/05/18/0b/177906917338170595a1c2935c76cd706dc03e542e_thumbnail_900x.webp", affiliateUrl: "https://onelink.shein.com/52/61ssc64you24?ismg_ol=DkFIZl4iCOC_01_KOC-C", palette: ["#dce6eb", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 31.97, affiliateReady: true }]), priceHistory: [40.95, 37.9, 34.9, 31.97], foundMinutesAgo: 15, tags: ["cinto", "vintage", "azul e branco"], description: "Cinto unissex com padrão de porcelana azul e branco e fivela metálica gravada." },
  { slug: "jaqueta-streetwear-colorblock", name: "Jaqueta Masculina Streetwear Colorblock com Gola Alta", category: "roupas", subcategory: "Jaquetas", brand: "SHEIN", price: 130.46, oldPrice: 173.95, rating: 4.7, ratingCount: 100, image: "https://img.ltwebstatic.com/v4/j/spmp/2026/03/08/15/17729537519df09a75d0c423dd717abf89c46c02fc_thumbnail_900x.webp", affiliateUrl: "https://onelink.shein.com/52/61ssbqcpsebt?ismg_ol=DxTVYMMimfV_01_KOC-C", palette: ["#c95843", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 130.46, affiliateReady: true }]), priceHistory: [173.95, 159.9, 145.9, 130.46], foundMinutesAgo: 21, tags: ["streetwear", "colorblock", "gola alta"], description: "Jaqueta de moda masculina com bloco de cores, gola alta, estampa de letras e patchwork." },
  { slug: "vjs-colar-corrente-torcida", name: "VJS Colar Pingente de Corrente Torcida em Aço Inoxidável", category: "roupas", subcategory: "Joias e acessórios", brand: "VJS", price: 16.59, oldPrice: 16.95, rating: 4.82, ratingCount: 100, image: "https://img.ltwebstatic.com/v4/j/spmp/2025/08/03/10/175421066326d92d6bc6440639f5736ebf363225ca_thumbnail_900x.webp", affiliateUrl: "https://onelink.shein.com/52/61ssb2ocf1bl?ismg_ol=5AAB8HBqiYa_01_KOC-C", palette: ["#d8d5d0", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 16.59, affiliateReady: true }]), priceHistory: [16.95, 16.9, 16.59], foundMinutesAgo: 26, tags: ["aço inoxidável", "colar", "presente"], description: "Colar com pingente de corrente torcida em aço inoxidável para uso diário." },
  { slug: "sumwon-camiseta-oversized-script", name: "SUMWON Camiseta Oversized de Gola Careca com Impressão em Estilo de Rua", category: "roupas", subcategory: "Camisetas", brand: "SUMWON", price: 47.07, image: "https://img.ltwebstatic.com/v4/j/sxfs/2026/05/09/07/1778293926998bd14b4070b72f07451560e1f1a005_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t68mc64g0h?ismg_ol=EQGM2IBCS4Z_01_KOC-C", palette: ["#1f2327", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 47.07, affiliateReady: true }]), priceHistory: [47.07], foundMinutesAgo: 1, tags: ["oversized", "streetwear", "camiseta"], description: "SUMWON Camiseta Oversized de Gola Careca com Impressão em Estilo de Rua na Parte de Trás em Letra Cursiva e Mangas Curtas", source: "https://br.shein.com/SUMWON-Men-s-Black-Short-Sleeve-Shirt-With-White-Script-Print-Casual-Oversized-Fit-Round-Neck-Tee-Top-For-Streetwear%252CBlack-Graphic-Tees-Men%252CStreetwear-T-Shir-p-463005333-cat-1978.html", lastVerifiedAt: "2026-09-12T16:30:00.000Z", network: "shein", status: "published" },
  { slug: "manfinity-emrg-camiseta-floral", name: "Manfinity EMRG Camiseta Masculina Streetwear Preta com Estampa Floral em Relevo", category: "roupas", subcategory: "Camisetas", brand: "Manfinity EMRG", price: 87.39, image: "https://img.ltwebstatic.com/v4/j/pi/2026/03/24/79/1774318507f3824f55deee7cdaaa93507e1c2f56e2_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6981iegdu?ismg_ol=CManBgX8UXh_01_KOC-C", palette: ["#17191d", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 87.39, affiliateReady: true }]), priceHistory: [87.39], foundMinutesAgo: 2, tags: ["floral", "streetwear", "manga curta"], description: "Manfinity EMRG Camiseta Masculina Streetwear Preta de Verão com Estampa Floral em Relevo, Manga Curta", source: "https://br.shein.com/Manfinity-EMRG-Men-s-Streetwear-Black-Summer-Floral-Embossed-Print-Short-Sleeve-T-Shirt%252CCity-Break-Flower-Girl%252COutdoor-Music-Festival-Daily-Wear-Boyfriend-Gift-p-412782611-cat-1978.html", lastVerifiedAt: "2026-09-12T16:30:00.000Z", network: "shein", status: "published" },
  { slug: "manfinity-roughcore-camiseta-preta", name: "Manfinity Roughcore Camiseta Preta Masculina Oversized", category: "roupas", subcategory: "Camisetas", brand: "Manfinity Roughcore", price: 78.90, image: "https://img.ltwebstatic.com/v4/j/pi/2026/04/07/43/177552464853b1c3183b4e26bac3a3b31211a7d49f_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6a9j3isou?ismg_ol=IwL1cgodGmW_01_KOC-C", palette: ["#171717", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 78.90, affiliateReady: true }]), priceHistory: [78.90], foundMinutesAgo: 3, tags: ["preta", "oversized", "casual"], description: "Manfinity Roughcore Camiseta Preta Masculina de Manga Curta Oversized e Cropped Tamanho Padrão", source: "https://br.shein.com/Manfinity-Roughcore-Men-s-Black-Standard-Size-Cropped-Loose-Fit-Short-Sleeve-T-Shirt-p-437133022-cat-1978.html", lastVerifiedAt: "2026-09-12T16:30:00.000Z", network: "shein", status: "published" },
  { slug: "axepeak-camisa-polo-esportiva", name: "AXEPEAK Camisa Polo Esportiva com Zíper Curto", category: "roupas", subcategory: "Polos", brand: "AXEPEAK", price: 100.61, image: "https://img.ltwebstatic.com/v4/j/pi/2025/12/19/aa/176611218042897b548a210af374f691b05586d1c8_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6apbcgmyt?ismg_ol=C7HQJfVop2J_01_KOC-C", palette: ["#d7dde0", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 100.61, affiliateReady: true }]), priceHistory: [100.61], foundMinutesAgo: 4, tags: ["polo", "esportiva", "zíper"], description: "AXEPEAK Camisa Polo Esportiva com Zíper Curto", source: "https://br.shein.com/AXEPEAK-Short-Sleeve-Half-Zip-Sporty-POLO-Shirt-p-330458285-cat-1979.html", lastVerifiedAt: "2026-09-12T16:30:00.000Z", network: "shein", status: "published" },
  { slug: "stynvo-camiseta-slogan-streetwear", name: "STYNVO Camiseta Casual Masculina com Estampa de Slogan e Gola Redonda", category: "roupas", subcategory: "Camisetas", brand: "STYNVO", price: 84.50, oldPrice: 88.95, image: "https://img.ltwebstatic.com/v4/j/pi/2026/03/12/28/1773285401d70a340d3d57550c985d8f508d3485d9_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6botwfin3?ismg_ol=CoHzWM8K2RL_01_KOC-C", palette: ["#f1f1ec", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 84.50, affiliateReady: true }]), priceHistory: [88.95, 84.50], foundMinutesAgo: 1, tags: ["slogan", "streetwear", "camiseta"], description: "STYNVO Camiseta Casual Masculina com Estampa de Slogan, Gola Redonda, Manga Curta, Camiseta Gráfica Streetwear", source: "https://br.shein.com/STYNVO-Men-s-Slogan-Print-Round-Neck-Short-Sleeve-Casual-T-Shirt%252C-Quote-White-Graphic-Tee-Graphic-Tee-Streetwear-p-419887311-cat-1978.html", lastVerifiedAt: "2026-09-12T16:38:00.000Z", network: "shein", status: "published" },
  { slug: "manfinity-roghcode-camisa-floral", name: "Manfinity Roghcode Camisa Masculina com Estampa Floral Manuscrita", category: "roupas", subcategory: "Camisas", brand: "Manfinity Roghcode", price: 64.37, oldPrice: 91.95, image: "https://img.ltwebstatic.com/v4/j/pi/2025/12/22/3d/1766398211d9d1d243276382efca4795c8c3bc7adc_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6c2n48lua?ismg_ol=ExZT18mFBMz_01_KOC-C", palette: ["#d7d0c8", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 64.37, affiliateReady: true }]), priceHistory: [91.95, 64.37], foundMinutesAgo: 1, tags: ["floral", "camisa", "casual"], description: "Manfinity Roghcode Camisa de Manga Curta Ajuste Regular Masculina com Estampa Casual de Fonte Manuscrita Floral", source: "https://br.shein.com/Manfinity-Roghcode-Ink-Floral-Handwritten-Font-Casual-Print-Men-s-Regular-Fit-Short-Sleeve-Shirt%252C-Essential-For-Dates-And-Gatherings%252C-Suitable-As-Gift-For-Boyfriend-p-336092420-cat-1977.html", lastVerifiedAt: "2026-09-12T16:42:00.000Z", network: "shein", status: "published" },
  { slug: "manfinity-zone917-camiseta-anjo", name: "Manfinity ZONE917 Camiseta Branca com Estampa Floral de Anjo", category: "roupas", subcategory: "Camisetas", brand: "Manfinity ZONE917", price: 71.90, image: "https://img.ltwebstatic.com/v4/j/pi/2026/04/08/1e/1775611676d909cd9bb3de16af57be751a44cf9f6c_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6ckee8e8h?ismg_ol=EUdS5gK0D6G_01_KOC-C", palette: ["#f4f1e9", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 71.90, affiliateReady: true }]), priceHistory: [71.90], foundMinutesAgo: 2, tags: ["floral", "oversized", "casual"], description: "Manfinity ZONE917 Camiseta de Manga Curta Branca com Estampa Gráfica Floral de Anjo Vermelho, Corte Curto e Solto", source: "https://br.shein.com/Manfinity-ZONE917-Boxy-Cropped-Loose-Casual-Fashion-Red-Angel-Floral-Graphic-Print-White-Short-Sleeve-T-Shirt%252C-Gift-For-Friends%252C-Oversized-Fit-p-438423030-cat-1978.html", lastVerifiedAt: "2026-09-12T16:42:00.000Z", network: "shein", status: "published" },
  { slug: "stonegrade-camiseta-letter-print", name: "StoneGrade Camiseta Casual Masculina com Estampa de Letra", category: "roupas", subcategory: "Camisetas", brand: "StoneGrade", price: 76.99, image: "https://img.ltwebstatic.com/v4/j/pi/2026/02/28/f5/1772264348ad79e653b6aefe2cff0ab1753e05b0c1_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6cy7m2vyx?ismg_ol=1nJKHLFtkBa_01_KOC-C", palette: ["#e5e0d6", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 76.99, affiliateReady: true }]), priceHistory: [76.99], foundMinutesAgo: 2, tags: ["letter print", "verão", "camiseta"], description: "StoneGrade Camiseta Casual de Manga Curta com Estampa de Letra de Gola Redonda Masculina, Verão", source: "https://br.shein.com/StoneGrade-Men-s-Round-Neck-Letter-Print-Casual-Short-Sleeve-T-Shirt%252C-Summer-p-411160753-cat-1978.html", lastVerifiedAt: "2026-09-12T16:42:00.000Z", network: "shein", status: "published" },
  { slug: "sport-metrogents-camiseta-esportiva", name: "Sport MetroGents Camiseta Esportiva Masculina com Estampa Gráfica", category: "roupas", subcategory: "Esportivo", brand: "Sport MetroGents", price: 68.95, image: "https://img.ltwebstatic.com/v4/j/pi/2026/03/28/c9/1774670576844814f2cc17309bb03d1a8f396b7cb3_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6dc0tv9rw?ismg_ol=E3LuNPEHLZC_01_KOC-C", palette: ["#d8e0e2", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 68.95, affiliateReady: true }]), priceHistory: [68.95], foundMinutesAgo: 3, tags: ["esportivo", "academia", "camiseta"], description: "Sport MetroGents Camiseta Esportiva Masculina Casual Solta com Estampa Gráfica de Manga Curta, Academia", source: "https://br.shein.com/Sport-MetroGents-Men-s-Graphic-Print-Loose-Casual-Short-Sleeve-Sports-T-Shirt%252C-Gym-p-431679617-cat-2420.html", lastVerifiedAt: "2026-09-12T16:42:00.000Z", network: "shein", status: "published" },
  { slug: "camiseta-compressao-fitness-preta", name: "Camiseta Masculina de Compressão para Exercícios e Fitness", category: "roupas", subcategory: "Esportivo", brand: "SHEIN", price: 49.57, oldPrice: 49.99, image: "https://img.ltwebstatic.com/images3_spmp/2024/01/29/fb/1706494803d998374e99ccaa7c84f6eac7d424ef9e_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6dvr4yey7?ismg_ol=A5tKd3YnX7X_01_KOC-C", palette: ["#171717", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 49.57, affiliateReady: true }]), priceHistory: [49.99, 49.57], foundMinutesAgo: 3, tags: ["compressão", "fitness", "corrida"], description: "Camiseta Masculina de Compressão Confortável de Manga Curta para Exercícios, Roupas Esportivas de Fitness, Academia, Corrida", source: "https://br.shein.com/Men-s-Comfortable-Compression-Workout-Short-Sleeve-T-Shirt%252C-Sports-Fitness-Gym-Clothes%252C-Running-Athletic-Tops-Black-Summer-p-28753780-cat-2420.html", lastVerifiedAt: "2026-09-12T16:42:00.000Z", network: "shein", status: "published" },
  { slug: "stynvo-polo-rugby-retro", name: "STYNVO Camisa Polo Masculina Casual com Zíper e Estampa Retrô", category: "roupas", subcategory: "Polos", brand: "STYNVO", price: 122.50, oldPrice: 128.95, image: "https://img.ltwebstatic.com/images3_ccc/2023/11/15/98/1700039466b2c0de1408c1edc7d8101337e9f3d239_thumbnail_192x.avif", affiliateUrl: "https://onelink.shein.com/52/61t6g2odhb8e?ismg_ol=4dY8MOPUQUc_01_KOC-C", palette: ["#d9d5ca", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 122.50, affiliateReady: true }]), priceHistory: [128.95, 122.50], foundMinutesAgo: 2, tags: ["polo", "rugby", "retrô"], description: "STYNVO Camisa Polo Masculina Casual com Zíper e Meio Bolso Estampada, Estilo Universitário e Retrô", source: "https://br.shein.com/STYNVO-Men-s-Casual-Printed-Zip-Up-Half-Placket-Polo-Shirt-College-Style-Pattern-Men-Rugby-Retro-Short-Sleeve-p-327614737-cat-1979.html", lastVerifiedAt: "2026-09-12T16:45:00.000Z", network: "shein", status: "published" },
  { slug: "pavtros-camisa-letter-print", name: "PAVTROS Camisa Casual Masculina com Estampa de Letra", category: "roupas", subcategory: "Camisas", brand: "PAVTROS", price: 85.49, oldPrice: 89.99, image: "https://img.ltwebstatic.com/v4/j/pi/2026/07/05/a6/1783235694306d7cc18c2d5829303d8a211d3b966b_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6h840t25f?ismg_ol=8Ex5B8Hm1Vn_01_KOC-C", palette: ["#d5d0c8", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 85.49, affiliateReady: true }]), priceHistory: [89.99, 85.49], foundMinutesAgo: 1, tags: ["camisa", "estampa", "casual"], description: "PAVTROS Camisa casual de manga curta com estampa de letra de botão único para homens", source: "https://br.shein.com/PAVTROS-Men-s-Letter-Print-Single-Breasted-Casual-Short-Sleeve-Shirt-Mens-Cropped-Shirt-Boxy-Shirt-Men-Work-Shirt-Customise-Shirt-p-414050986-cat-1977.html", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "polo-colegial-americana-meninos", name: "Camiseta Polo Estilo Colegial Americano com Estampa de Letra", category: "roupas", subcategory: "Polos", brand: "SHEIN", price: 73.95, image: "https://img.ltwebstatic.com/images3_pi/2025/02/18/77/1739843469b97e97007fb63fa81296b14c6b2a0416_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6hlx8m5cu?ismg_ol=HehEyqBW1zN_01_KOC-C", palette: ["#dbe0df", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 73.95, affiliateReady: true }]), priceHistory: [73.95], foundMinutesAgo: 1, tags: ["polo", "colegial", "letter print"], description: "Camiseta Polo Estilo Colegial Americano com Estampa de Letra, Estilosa para Adolescentes Meninos", source: "https://br.shein.com/Teenager-Boys-Casual-American-College-Style-Letter-Print-Stylish-Polo-Shirt-p-57035777-cat-6968.html", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "stynvo-camiseta-letter-print-verao", name: "STYNVO Camiseta Casual Masculina com Estampa de Letra", category: "roupas", subcategory: "Camisetas", brand: "STYNVO", price: 80.74, oldPrice: 84.99, image: "https://img.ltwebstatic.com/v4/j/pi/2026/02/09/23/1770602268e91a382953c604a4fb4fb7042a182875_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6i1phil2y?ismg_ol=4x4vgMQxAe5_01_KOC-C", palette: ["#e6e4dd", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 80.74, affiliateReady: true }]), priceHistory: [84.99, 80.74], foundMinutesAgo: 2, tags: ["letra", "verão", "camiseta"], description: "STYNVO Camiseta Casual Masculina de Manga Curta, Gola Redonda, Estampa de Letra Solta, Verão", source: "https://br.shein.com/STYNVO-Men-s-Letter-Print-Loose-Casual-Round-Neck-Short-Sleeve-T-Shirt%252C-Summer-Street-Wear-Tee-Streetwear-Men-T-Shirts-p-401392997-cat-1978.html", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "slatemann-shorts-letter-print", name: "SLATEMANN Shorts Casual Masculina com Estampa de Letra", category: "roupas", subcategory: "Shorts", brand: "SLATEMANN", price: 82.57, oldPrice: 117.95, image: "https://img.ltwebstatic.com/v4/j/pi/2026/01/30/59/17697374430baf687c5e69cf43bbac3042d60a41a3_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6idjo67ox?ismg_ol=2Uzrv7pMOEq_01_KOC-C", palette: ["#8a8075", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 82.57, affiliateReady: true }]), priceHistory: [117.95, 82.57], foundMinutesAgo: 2, tags: ["shorts", "verão", "cordão"], description: "SLATEMANN Shorts Casual de Verão Masculina com Estampa de Letra e Cordão na Cintura", source: "https://br.shein.com/SLATEMANN-Men-s-Summer-Casual-Letter-Print-Drawstring-Waist-Shorts-p-391295509-cat-1974.html", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "pavtros-conjunto-camiseta-shorts", name: "PAVTROS Conjunto Casual com Camiseta e Shorts", category: "roupas", subcategory: "Conjuntos", brand: "PAVTROS", price: 186.11, oldPrice: 195.90, image: "https://img.ltwebstatic.com/v4/j/pi/2026/06/16/7b/17815901595001af71e7e58d2483a23f7352d444e2_thumbnail_220x293.webp", affiliateUrl: "https://onelink.shein.com/52/61t6ivay8t9f?ismg_ol=CBlez3Cyiew_01_KOC-C", palette: ["#d4d1ca", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 186.11, affiliateReady: true }]), priceHistory: [195.90, 186.11], foundMinutesAgo: 3, tags: ["conjunto", "camiseta", "shorts"], description: "PAVTROS Camiseta de Manga Curta com Estampa de Letra e Gola Redonda Masculina e Shorts com Cordão na Cintura", source: "https://br.shein.com/PAVTROS-Men-s-Crew-Neck-Letter-Print-Short-Sleeve-T-Shirt-And-Drawstring-Waist-Shorts-Casual-Daily-Outfit-p-503333220-cat-1973.html", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "stonegrade-camiseta-rosa-oversized-cropped", name: "StoneGrade Camiseta Masculina Rosa de Manga Curta Oversized e Cropped", category: "roupas", subcategory: "Camisetas", brand: "StoneGrade", price: 0, image: "https://img.ltwebstatic.com/v4/j/pi/2026/04/03/f5/177518390660608c0b3792344ca443a2469e59ed4e_thumbnail_405x552.jpg", affiliateUrl: "https://onelink.shein.com/52/61t6f73vp4xk?ismg_ol=0Yb9TTayg1q_01_KOC-C", palette: ["#f0b3ad", "#ff5a1f"], offers: bestOffer([{ store: "SHEIN", price: 0, affiliateReady: true }]), priceHistory: [], foundMinutesAgo: 4, tags: ["oversized", "cropped", "rosa"], description: "Camiseta masculina StoneGrade em rosa salmão, manga curta, caimento oversized e visual cropped.", source: "https://onelink.shein.com/52/61t6f73vp4xk?ismg_ol=0Yb9TTayg1q_01_KOC-C", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "pavtros-polo-bordada-streetwear", name: "PAVTROS Camisa Polo Bordada de Estilo de Rua", category: "roupas", subcategory: "Polos", brand: "PAVTROS", price: 104.72, image: "https://img.ltwebstatic.com/v4/j/pi/2026/04/07/91/1775553209323930714779f643707f40a15808724e_thumbnail_405x552.jpg", affiliateUrl: "https://onelink.shein.com/52/61t6fkx3g48o?ismg_ol=3A60RmQ44Xd_01_KOC-C", palette: ["#d7d2c8", "#ff5a1f"], offers: bestOffer([{ store: "SHEIN", price: 104.72, affiliateReady: true }]), priceHistory: [104.72], foundMinutesAgo: 5, tags: ["polo", "bordada", "streetwear"], description: "Camisa polo bordada PAVTROS com logotipo pequeno e estética streetwear.", source: "https://onelink.shein.com/52/61t6fkx3g48o?ismg_ol=3A60RmQ44Xd_01_KOC-C", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "sumwon-camiseta-grafica-moderna-oversized", name: "SUMWON Camiseta Gráfica Moderna Oversized", category: "roupas", subcategory: "Camisetas", brand: "SUMWON", price: 73.95, oldPrice: 113.76, image: "https://img.ltwebstatic.com/v4/j/pi/2025/07/03/0e/17515076070edd5fdc0095184269372aeecaeb278e_thumbnail_405x552.jpg", affiliateUrl: "https://onelink.shein.com/52/61t6geik4xy2?ismg_ol=1VC9lFs738E_01_KOC-C", palette: ["#d9d4ca", "#ff5a1f"], offers: bestOffer([{ store: "SHEIN", price: 73.95, affiliateReady: true }]), priceHistory: [113.76, 73.95], foundMinutesAgo: 6, tags: ["oversized", "arte", "streetwear"], description: "Camiseta gráfica moderna SUMWON, oversized, com estampa de arte contemporânea e gola careca.", source: "https://onelink.shein.com/52/61t6geik4xy2?ismg_ol=1VC9lFs738E_01_KOC-C", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "manfinity-roghcode-camiseta-cropped-letter", name: "Manfinity Roghcode Camiseta Casual Masculina Solta com Estampa de Letra", category: "roupas", subcategory: "Camisetas", brand: "Manfinity Roghcode", price: 0, image: "https://img.ltwebstatic.com/v4/j/pi/2026/02/28/88/1772264265454f02e04c0f1e4cc3fcefe17da818a3_thumbnail_405x552.jpg", affiliateUrl: "https://onelink.shein.com/52/61t6gw9u6u57?ismg_ol=JIgMiHg2HEA_01_KOC-C", palette: ["#e9e3d8", "#ff5a1f"], offers: bestOffer([{ store: "SHEIN", price: 0, affiliateReady: true }]), priceHistory: [], foundMinutesAgo: 7, tags: ["cropped", "letra", "verão"], description: "Camiseta casual masculina Manfinity Roghcode, solta, cropped e com estampa de letra.", source: "https://onelink.shein.com/52/61t6gw9u6u57?ismg_ol=JIgMiHg2HEA_01_KOC-C", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "stynvo-moletom-capuz-ziper-bordado", name: "STYNVO Moletom com Capuz de Manga Longa com Zíper Bordado", category: "roupas", subcategory: "Moletons", brand: "STYNVO", price: 168.76, image: "https://img.ltwebstatic.com/v4/j/smartflow/2026/08/17/17/1786933045e21e5d1bc3609d1848f95fe1983d86d1_thumbnail_405x552.jpg", affiliateUrl: "https://onelink.shein.com/52/61t6j945zsl6?ismg_ol=LiOoSE18fE1_01_KOC-C", palette: ["#1f1f1f", "#ff5a1f"], offers: bestOffer([{ store: "SHEIN", price: 168.76, affiliateReady: true }]), priceHistory: [168.76], foundMinutesAgo: 8, tags: ["moletom", "capuz", "zíper"], description: "Moletom STYNVO com capuz, manga longa, zíper frontal e detalhe bordado.", source: "https://onelink.shein.com/52/61t6j945zsl6?ismg_ol=LiOoSE18fE1_01_KOC-C", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "tenis-esportivo-sola-grossa-malha", name: "Tênis Esportivos Masculinos de Sola Grossa com Malha Respirável", category: "calcados", subcategory: "Tênis", brand: "SHEIN", price: 0, image: "https://img.ltwebstatic.com/v4/j/spmp/2026/06/06/d5/17807237996c20a1dde5e2957071d7ac2bcd417920_thumbnail_405x552.jpg", affiliateUrl: "https://onelink.shein.com/52/61t6jmxdrh86?ismg_ol=DUMzh8RTHg7_01_KOC-C", palette: ["#e8e8e2", "#ff5a1f"], offers: bestOffer([{ store: "SHEIN", price: 0, affiliateReady: true }]), priceHistory: [], foundMinutesAgo: 9, tags: ["tênis", "corrida", "malha"], description: "Tênis esportivo masculino branco e preto, sola grossa, malha respirável e estilo casual de rua.", source: "https://onelink.shein.com/52/61t6jmxdrh86?ismg_ol=DUMzh8RTHg7_01_KOC-C", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "pavtros-moletom-gola-redonda-preto", name: "PAVTROS Moletom Masculino de Gola Redonda com Estampa Manuscrita", category: "roupas", subcategory: "Moletons", brand: "PAVTROS", price: 0, image: "https://img.ltwebstatic.com/v4/j/pi/2026/08/07/d9/1786067188ca058be3036e1deda1bd464b7da4e9a6_thumbnail_405x552.jpg", affiliateUrl: "https://onelink.shein.com/52/61t6k0qllyvr?ismg_ol=LXcmGyTupqd_01_KOC-C", palette: ["#151515", "#ff5a1f"], offers: bestOffer([{ store: "SHEIN", price: 0, affiliateReady: true }]), priceHistory: [], foundMinutesAgo: 10, tags: ["moletom", "preto", "streetwear"], description: "Moletom masculino PAVTROS preto, gola redonda, ajuste solto e estampa de texto manuscrito.", source: "https://onelink.shein.com/52/61t6k0qllyvr?ismg_ol=LXcmGyTupqd_01_KOC-C", lastVerifiedAt: "2026-09-12T16:50:00.000Z", network: "shein", status: "published" },
  { slug: "hair-one-vitamina-c-d-night-pouch", name: "Hair One + Vitamina C + Vitamina D + Brinde Night Pouch", category: "beleza", subcategory: "Suplementos", brand: "TikTok Shop", price: 0, image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/1a85117b5ce044c3998a36149e2725b9~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9S4XjuP7AMK-KUUlb/", palette: ["#efe2d0", "#ff4d8d"], offers: bestOffer([{ store: "TikTok Shop", price: 0, affiliateReady: true }]), priceHistory: [], foundMinutesAgo: 11, tags: ["beleza", "vitamina", "tiktok shop"], description: "Kit Hair One com Vitamina C, Vitamina D e brinde Night Pouch encontrado pelo Cardinal no TikTok Shop.", source: "https://vt.tiktok.com/ZS9S4XjuP7AMK-KUUlb/", lastVerifiedAt: "2026-09-12T19:05:00.000Z", network: "tiktok-shop", status: "published" },
  { slug: "manfinity-hypemode-homens-camiseta-bordado-de-letr-458", name: "Manfinity Hypemode Homens Camiseta Bordado de letras Coleira de lapela", category: "roupas", subcategory: "Roupas", brand: "SHEIN", price: 66.39, oldPrice: 82.99, image: "https://img.ltwebstatic.com/images3_pi/2022/07/18/165813285487234609a69067a310b7a5273f8422fd_thumbnail_405x552.jpg", affiliateUrl: "https://br.shein.com/Manfinity-Hypemode-Men-Letter-Embroidery-Lapel-Collar-Tee-p-11069969-cat-1978.html", palette: ["#171717", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 66.39, affiliateReady: true }]), priceHistory: [82.99, 66.39], foundMinutesAgo: 1, tags: ["shein"], description: "Manfinity Hypemode Homens Camiseta Bordado de letras Coleira de lapela", source: "https://br.shein.com/Manfinity-Hypemode-Men-Letter-Embroidery-Lapel-Collar-Tee-p-11069969-cat-1978.html", lastVerifiedAt: "2026-09-12T19:22:31.705Z", network: "shein", status: "published" },
  { slug: "camiseta-b-sica-masculina-fractyr-de-estilo-de-rua-880", name: "Camiseta Básica Masculina FRACTYR de Estilo de Rua Casual, Corte Solto, Gola Careca, Branca Minimalista, Versátil, Confortável e Respirável para Uso Externo", category: "roupas", subcategory: "Roupas", brand: "SHEIN", price: 51.24, image: "https://img.ltwebstatic.com/v4/j/spmp/2026/06/17/00/1781685310eafea92b1cb43c681df1147098cabaf2_thumbnail_405x552.jpg", affiliateUrl: "https://br.shein.com/FRACTYR-Men-s-Casual-Streetwear-Minimalist-Loose-Crew-Neck-Short-Sleeve-T-Shirt%252C-Versatile-Basic-Tee%252C-Comfortable-And-Breathable-For-Daily-Wear-p-466370036-cat-1978.html", palette: ["#171717", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 51.24, affiliateReady: true }]), priceHistory: [51.24], foundMinutesAgo: 1, tags: ["shein"], description: "Camiseta Básica Masculina FRACTYR de Estilo de Rua Casual, Corte Solto, Gola Careca, Branca Minimalista, Versátil, Confortável e Respirável para Uso Externo", source: "https://br.shein.com/FRACTYR-Men-s-Casual-Streetwear-Minimalist-Loose-Crew-Neck-Short-Sleeve-T-Shirt%252C-Versatile-Basic-Tee%252C-Comfortable-And-Breathable-For-Daily-Wear-p-466370036-cat-1978.html", lastVerifiedAt: "2026-09-12T19:22:31.716Z", network: "shein", status: "published" },
  { slug: "axepeak-camiseta-casual-masculina-de-malha-solta-d-287", name: "AXEPEAK Camiseta Casual Masculina de Malha Solta de Manga Curta com Recortes, Uso Diário para Jovens Adultos, Edição Streetwear, Estilo Anos 2000", category: "roupas", subcategory: "Roupas", brand: "SHEIN", price: 68.64, oldPrice: 78.9, image: "https://img.ltwebstatic.com/v4/j/pi/2025/06/09/01/1749434228265e42fd9f96c1edcedbc3c82728b205_thumbnail_405x552.jpg", affiliateUrl: "https://br.shein.com/AXEPEAK-Men-s-Knitted-Casual-Loose-Short-Sleeve-Patchwork-T-Shirt%252C-Daily-Wear-For-Young-Adults%252C-Streetwear-Edit%252C-2000s-Style-p-95865219-cat-1978.html", palette: ["#171717", "#ff7a00"], offers: bestOffer([{ store: "SHEIN", price: 68.64, affiliateReady: true }]), priceHistory: [78.9, 68.64], foundMinutesAgo: 1, tags: ["shein"], description: "AXEPEAK Camiseta Casual Masculina de Malha Solta de Manga Curta com Recortes, Uso Diário para Jovens Adultos, Edição Streetwear, Estilo Anos 2000", source: "https://br.shein.com/AXEPEAK-Men-s-Knitted-Casual-Loose-Short-Sleeve-Patchwork-T-Shirt%252C-Daily-Wear-For-Young-Adults%252C-Streetwear-Edit%252C-2000s-Style-p-95865219-cat-1978.html", lastVerifiedAt: "2026-09-12T19:22:31.722Z", network: "shein", status: "published" },
  tiktokProduct({ slug: "tiktok-polo-poliamida-corte-laser", name: "Camiseta Masculina Polo Poliamida Tecnológica Premium Corte a Laser", category: "roupas", subcategory: "Polos", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/72040493d8424ef081ef25f3574a8705~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJse2DUaC-9CI7s/", foundMinutesAgo: 1, tags: ["polo", "poliamida", "premium"], description: "Polo masculina de poliamida com corte a laser, visual moderno e proposta casual versátil." }),
  tiktokProduct({ slug: "tiktok-kit-5-camisetas-dry-fit", name: "Kit 5 Camisetas Dry Fit Masculina Lisa Básica", category: "roupas", subcategory: "Camisetas", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/72bc695603344e8f9df80f400ec10d99~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJsdpMKQV-sxNYZ/", foundMinutesAgo: 2, tags: ["dry fit", "academia", "kit"], description: "Kit com cinco camisetas dry fit lisas para academia, treino e uso diário." }),
  tiktokProduct({ slug: "tiktok-kit-3-camiseta-oversized-lisa", name: "Kit 3 Camisetas Masculinas Oversized Lisa Clássica", category: "roupas", subcategory: "Camisetas", image: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/7149c2cc468c4fd0939c2b504878826d~tplv-o3syd03w52-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJ7nBYBpo-qlHiC/", foundMinutesAgo: 3, tags: ["oversized", "kit", "verão"], description: "Kit com três camisetas oversized lisas, básicas e fáceis de combinar." }),
  tiktokProduct({ slug: "tiktok-camiseta-jujutsu-kaisen-sukuna", name: "Camiseta Jujutsu Kaisen Ryomen Sukuna Streetwear", category: "roupas", subcategory: "Camisetas", image: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/85dc438253744d33949e8669dc74327e~tplv-o3syd03w52-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJ3H2A3oj-EW4cr/", foundMinutesAgo: 4, tags: ["anime", "streetwear", "algodão"], description: "Camiseta temática Jujutsu Kaisen com estampa Ryomen Sukuna e tecido 100% algodão." }),
  tiktokProduct({ slug: "tiktok-kit-2-camiseta-tsx-rodeio", name: "Kit 2 Camisetas TSX Rodeio Country Unissex", category: "roupas", subcategory: "Camisetas", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/eaa7e3fe37cd4f44853c9a0c3c7da30a~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJwWNNH34-7rsne/", foundMinutesAgo: 5, tags: ["country", "unissex", "kit"], description: "Kit com duas camisetas TSX de estética country para uso casual." }),
  tiktokProduct({ slug: "tiktok-chinelo-asuna-slide-nuvem", name: "Chinelo Asuna 3.0 Slide Nuvem Masculino e Feminino", category: "calcados", subcategory: "Chinelos", image: "https://p19-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/86a803552bdf4b06b6e47f0074b1ccd3~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVeMM2G1Fy-wzrv8/", foundMinutesAgo: 6, tags: ["chinelo", "slide", "nuvem"], description: "Slide estilo nuvem para uso masculino e feminino, com proposta leve e confortável." }),
  tiktokProduct({ slug: "tiktok-jaqueta-puffer-impermeavel-bobojaco", name: "Jaqueta Bobojaco Puffer Impermeável Corta Vento", category: "roupas", subcategory: "Jaquetas", image: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/3b8c6e0d1a1b4511858dc4e9d7441ff7~tplv-o3syd03w52-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVeaLaRmCy-rwZc8/", foundMinutesAgo: 7, tags: ["puffer", "frio", "impermeável"], description: "Jaqueta puffer com capuz, bolso interno e construção para frio intenso." }),
  tiktokProduct({ slug: "tiktok-chinelo-feminino-strass", name: "Chinelo Feminino Luxo Strass Brilhante", category: "calcados", subcategory: "Chinelos", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/937eda3788b14961af3dc12028a4c886~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVexUPMq35-Xu9bY/", foundMinutesAgo: 8, tags: ["strass", "feminino", "leve"], description: "Chinelo feminino leve com acabamento brilhante em strass." }),
  tiktokProduct({ slug: "tiktok-babuche-feminina-eva-strass-perolas", name: "Babuche Feminina EVA com Strass e Pérolas", category: "calcados", subcategory: "Babuche", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/bf4d1e9fe08a47779d2a84cbdc97a680~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVexCsMGf3-2ibbs/", foundMinutesAgo: 9, tags: ["babuche", "eva", "praia"], description: "Babuche feminina em EVA com enfeites, pensada para praia, piscina e rotina confortável." }),
  tiktokProduct({ slug: "tiktok-olevs-relogio-masculino-cronografo", name: "OLEVS Relógio Masculino Cronógrafo Mostrador Preto", category: "tech", subcategory: "Relógios", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/9448a8f404084f73ad0ff6d15382f825~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVegHhpuQ8-sE4S8/", foundMinutesAgo: 10, tags: ["relógio", "cronógrafo", "olevs"], description: "Relógio masculino OLEVS de quartzo, multifuncional, com calendário e resistência à água." }),
  tiktokProduct({ slug: "tiktok-short-jeans-feminino-cintura-alta", name: "Short Jeans Feminino Meia Coxa Cintura Alta", category: "roupas", subcategory: "Shorts", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/34e177ebfbf5499fb039c8153e62414c~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVetNPtJNN-R7J7U/", foundMinutesAgo: 11, tags: ["jeans", "cintura alta", "feminino"], description: "Short jeans feminino de cintura alta com bolso e modelagem confortável." }),
  tiktokProduct({ slug: "tiktok-conjunto-academia-short-regata", name: "Conjunto Academia Short com Bolso e Regata Frente Única", category: "roupas", subcategory: "Fitness", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/2f89a88c68cf4a2bafed73eacf1d5cc8~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVe7G8BDpy-lmGjV/", foundMinutesAgo: 12, tags: ["academia", "yoga", "pilates"], description: "Conjunto para treino com short de bolso e regata frente única." }),
  tiktokProduct({ slug: "tiktok-pijama-baby-doll-canelado-coracao", name: "Pijama Baby Doll Feminino Canelado de Coração", category: "roupas", subcategory: "Pijamas", image: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/6e1f3936c60a4a439c02966c17d75665~tplv-o3syd03w52-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVeo6DE189-uYfQ4/", foundMinutesAgo: 13, tags: ["pijama", "baby doll", "canelado"], description: "Conjunto baby doll feminino canelado com estampa de coração e detalhe de lacinho." }),
  tiktokProduct({ slug: "tiktok-calca-cargo-jeans-feminina-wide-leg", name: "Calça Cargo Jeans Feminina Wide Leg Cintura Alta", category: "roupas", subcategory: "Calças", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/c2a7f31c7dd14defbbd67bbb33cbf4ac~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVdJ4Fmh1q-sm8jo/", foundMinutesAgo: 14, tags: ["cargo", "jeans", "wide leg"], description: "Calça cargo jeans feminina wide leg, cintura alta e bolsos frontais laterais." }),
  tiktokProduct({ slug: "tiktok-short-fitness-canelado-cintura-alta", name: "Short Fitness Academia Canelado Cintura Alta", category: "roupas", subcategory: "Fitness", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/d129b12702284343835b3448f985a699~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVdYB9EXKK-XPA6m/", foundMinutesAgo: 15, tags: ["fitness", "canelado", "short"], description: "Short fitness canelado de cintura alta para academia e rotina ativa." }),
  tiktokProduct({ slug: "tiktok-polo-ziper-malha-canelada", name: "Camiseta Polo Manga Curta com Zíper Masculina Canelada", category: "roupas", subcategory: "Polos", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/6b6d5bb8ab3c4215ae742c1312f5fff4~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJN6asErb-aUKs5/", foundMinutesAgo: 16, tags: ["polo", "zíper", "canelada"], description: "Polo masculina canelada com manga curta e zíper frontal." }),
  tiktokProduct({ slug: "tiktok-kit-3-camisetas-algodao-fio-301", name: "Kit 3 Camisetas Masculinas 100% Algodão Fio 30.1", category: "roupas", subcategory: "Camisetas", image: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/55570cc246114b5cb047ecd74f881188~tplv-o3syd03w52-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJ6gN2tnk-sw0dy/", foundMinutesAgo: 17, tags: ["algodão", "kit", "básica"], description: "Kit com três camisetas masculinas de algodão, gola redonda e várias cores." }),
  tiktokProduct({ slug: "tiktok-kit-3-polo-ziper-canelada", name: "Kit 3 Camisetas Polo Manga Curta com Zíper", category: "roupas", subcategory: "Polos", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/83924c83746e470fbed507e2d932c800~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJrr7TMKV-ePjfj/", foundMinutesAgo: 18, tags: ["polo", "kit", "zíper"], description: "Kit com três polos masculinas caneladas de manga curta com zíper." }),
  tiktokProduct({ slug: "tiktok-luva-microfibra-lavagem-carro", name: "Luva de Microfibra para Lavagem de Carro Multiuso", category: "casa", subcategory: "Automóvel", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/6112d6eed403430b9dc7406ed539c65e~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJBwss6qu-bclph/", foundMinutesAgo: 19, tags: ["microfibra", "automóvel", "limpeza"], description: "Luva de microfibra multiuso para lavagem, detalhamento automotivo e limpeza da casa." }),
  tiktokProduct({ slug: "tiktok-creatina-soldiers-nutrition", name: "Creatina Monohidratada 100% Pura Soldiers Nutrition", category: "beleza", subcategory: "Suplementos", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/2f03208c611348c383a4c828e517d3ce~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJ6bL1j7D-2NFlW/", foundMinutesAgo: 20, tags: ["creatina", "suplemento", "soldiers"], description: "Creatina monohidratada em pó 100% pura da Soldiers Nutrition." }),
  tiktokProduct({ slug: "tiktok-camiseta-manga-longa-canelada-slim", name: "Camiseta Masculina Manga Longa Canelada Slim Fit", category: "roupas", subcategory: "Camisetas", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/b09a028f5abb4f9985c6687123cc30ae~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJUL7JqPP-Z5OXJ/", foundMinutesAgo: 21, tags: ["manga longa", "slim", "canelada"], description: "Camiseta masculina canelada de manga longa, slim fit e estilo casual." }),
  tiktokProduct({ slug: "tiktok-camiseta-manga-longa-los-angeles", name: "Camiseta Manga Longa Masculina Los Angeles", category: "roupas", subcategory: "Camisetas", image: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/35f82e1ec4014532b6d46762cd6ebe56~tplv-o3syd03w52-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJaTCKVmj-S98xg/", foundMinutesAgo: 22, tags: ["manga longa", "los angeles", "algodão"], description: "Blusa masculina de manga longa Los Angeles, em algodão, para dias mais frios." }),
  tiktokProduct({ slug: "tiktok-camisa-social-gola-padre-slim", name: "Camisa Social Masculina Gola Padre Slim Fit", category: "roupas", subcategory: "Camisas", image: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/c8ffa30cb7d24dfba10afe4e66e71055~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543", affiliateUrl: "https://vt.tiktok.com/ZS9SVJxteMKV6-3vOmL/", foundMinutesAgo: 23, tags: ["camisa social", "gola padre", "slim"], description: "Camisa social masculina de manga curta, gola padre e modelagem slim fit." }),
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getByCategory(category: Category) {
  return products.filter((p) => p.category === category);
}

export function getDeals() {
  return products
    .filter((p) => p.oldPrice)
    .sort((a, b) => discountPct(b) - discountPct(a));
}

export function discountPct(p: Product) {
  if (!p.oldPrice) return 0;
  return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
}

export function savings(p: Product) {
  if (!p.oldPrice) return 0;
  return p.oldPrice - p.price;
}

export function opportunityScore(p: Product) {
  let score = 55;
  score += Math.min(discountPct(p), 40);
  if (p.rating) score += Math.round((p.rating - 4) * 10);
  score += Math.max(0, 10 - Math.floor(p.foundMinutesAgo / 10));
  return Math.max(1, Math.min(99, score));
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatPrice(product: Product) {
  return product.price > 0 ? formatBRL(product.price) : "Preço surpresa";
}

export function unknownPriceCallout(product: Product) {
  if (product.price > 0) return null;
  const hooks = [
    "Preço escondido, achado quente",
    "Absurdo de barato? Confere agora",
    "Oferta relâmpago na loja",
    "Esse aqui pisca no radar",
    "Preço surpresa liberado no clique",
    "Achado com cara de viral",
    "Barato demais para ignorar",
    "Cardinal marcou como quente",
  ];
  return hooks[hashString(product.slug) % hooks.length];
}

export function dealTone(product: Product) {
  const tones = ["flame", "gold", "rose", "electric", "lime"] as const;
  return tones[hashString(product.slug) % tones.length];
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function socialProof(product: Product) {
  const proof = [];
  if (product.rating && product.ratingCount) proof.push(`${product.rating.toFixed(1)} de ${formatCompactNumber(product.ratingCount)} avaliações`);
  if (product.salesCount) proof.push(`${formatCompactNumber(product.salesCount)} vendas`);
  return proof;
}

export function productImageUrl(product: Product) {
  return product.image.replace(/_thumbnail_(?:220x293|405x552|192x)\.(?:webp|jpg|avif)/, "_thumbnail_900x.webp");
}

export const categories: { slug: Category; label: string; href: string; kicker: string }[] = [
  { slug: "roupas", label: "Roupas", href: "/roupas", kicker: "Forma, tecido, rua" },
  { slug: "perfumes", label: "Perfumes", href: "/perfumes", kicker: "Achados selecionados" },
  { slug: "beleza", label: "Beleza", href: "/ofertas?cat=beleza", kicker: "Rotina e cuidado" },
  { slug: "calcados", label: "Calçados", href: "/ofertas?cat=calcados", kicker: "Passo e presença" },
  { slug: "casa", label: "Casa", href: "/ofertas?cat=casa", kicker: "Uso real, achado bom" },
  { slug: "tech", label: "Tech", href: "/ofertas?cat=tech", kicker: "Gadgets e acessórios" },
];

export const affiliateCode = "QCW38LD";

export function categoryHref(category: Category) {
  if (category === "roupas" || category === "perfumes") return `/${category}`;
  return `/ofertas?cat=${category}`;
}

export function getPublishedByCategory(category: Category) {
  return getPublishedProducts().filter((product) => product.category === category);
}

export function getActiveCategories() {
  return categories.filter((category) => getPublishedByCategory(category.slug).length > 0);
}

export function getPublicNavItems() {
  return [
    { href: "/", label: "Início" },
    { href: "/ofertas", label: "Ofertas" },
    ...getActiveCategories().map((category) => ({ href: category.href, label: category.label })),
    { href: "/salvos", label: "Salvos" },
  ];
}

export function getPublishedProducts() {
  return products.filter(
    (product) =>
      product.status !== "draft" &&
      product.image.startsWith("https://") &&
      isAllowedAffiliateUrl(product.affiliateUrl),
  );
}

export function getRelated(product: Product, limit = 4) {
  return getPublishedProducts()
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .slice(0, limit);
}

export function lowestObserved(product: Product) {
  if (!product.priceHistory.length) return null;
  return Math.min(...product.priceHistory);
}

export function hasUsableHistory(product: Product) {
  return product.priceHistory.length >= 3;
}
