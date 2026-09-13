import type { Metadata } from "next";
import SavedFinds from "@/components/SavedFinds";

export const metadata: Metadata = {
  title: "Meus achados",
  description: "Ofertas salvas localmente no seu aparelho.",
  robots: { index: false, follow: false },
};

export default function SalvosPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal">Local</p>
      <h1 className="mt-3 font-display text-5xl font-black tracking-tight">Meus achados</h1>
      <p className="mt-4 max-w-lg text-sm text-mist">Guardados neste navegador. Sem login.</p>
      <div className="mt-10">
        <SavedFinds />
      </div>
    </div>
  );
}
