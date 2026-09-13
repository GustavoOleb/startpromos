import HeroRadar from "@/components/HeroRadar";
import SignalTicker from "@/components/SignalTicker";
import FeaturedDeals from "@/components/FeaturedDeals";
import HorizontalFinds from "@/components/HorizontalFinds";
import DealVault from "@/components/DealVault";
import RadarExplanation from "@/components/RadarExplanation";
import Reveal from "@/components/Reveal";
import CardinalShowcases from "@/components/CardinalShowcases";
import { discountPct, getPublishedProductsLive } from "@/lib/products";

export default async function Home() {
  const catalog = await getPublishedProductsLive();
  const ranked = [...catalog].sort((a, b) => discountPct(b) - discountPct(a) || a.foundMinutesAgo - b.foundMinutesAgo);
  const featured = ranked.slice(0, 4);
  const vault = ranked.slice(4, 13);
  const rail = ranked.slice(2, 10);

  return (
    <>
      <HeroRadar products={catalog} />
      <SignalTicker />
      <Reveal>
        <FeaturedDeals products={featured} />
      </Reveal>
      <HorizontalFinds products={rail} />
      <Reveal>
        <CardinalShowcases products={ranked} />
      </Reveal>
      <Reveal>
        <DealVault products={vault} />
      </Reveal>
      <Reveal>
        <RadarExplanation />
      </Reveal>
    </>
  );
}
