import type { Metadata } from "next";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6">
      <EmptyState title="Sinal perdido" copy="Essa rota não existe no radar." href="/" cta="Voltar ao início" />
    </div>
  );
}
