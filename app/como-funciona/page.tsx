import type { Metadata } from "next";
import RadarExplanation from "@/components/RadarExplanation";

export const metadata: Metadata = {
  title: "Como funciona",
  description: "Como a StartPromos encontra e sinaliza ofertas.",
  alternates: { canonical: "/como-funciona" },
};

export default function ComoFuncionaPage() {
  return (
    <div className="pt-8">
      <RadarExplanation />
    </div>
  );
}
