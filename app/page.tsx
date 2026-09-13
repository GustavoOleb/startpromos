import HeroRadar from "@/components/HeroRadar";
import SignalTicker from "@/components/SignalTicker";
import FeaturedDeals from "@/components/FeaturedDeals";
import HorizontalFinds from "@/components/HorizontalFinds";
import DealVault from "@/components/DealVault";
import RadarExplanation from "@/components/RadarExplanation";
import Reveal from "@/components/Reveal";
import { discountPct, getPublishedProducts } from "@/lib/products";

export default function Home() {
  const catalog = getPublishedProducts();
  const ranked = [...catalog].sort((a, b) => discountPct(b) - discountPct(a) || a.foundMinutesAgo - b.foundMinutesAgo);
  const featured = ranked.slice(0, 4);
  const vault = ranked.slice(4, 13);
  const rail = ranked.slice(2, 10);

  return (
    <>
      <HeroRadar />
      <SignalTicker />
      <Reveal>
        <FeaturedDeals products={featured} />
      </Reveal>
      <HorizontalFinds products={rail} />
      <Reveal>
        <DealVault products={vault} />
      </Reveal>
      <Reveal>
        <RadarExplanation />
      </Reveal>
    </>
  );
}
