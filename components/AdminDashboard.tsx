"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BadgeCheck,
  Bot,
  ChartNoAxesCombined,
  Cloud,
  Database,
  Flame,
  LogOut,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import type { Product } from "@/lib/products";
import type { SupabaseHealth } from "@/lib/supabase";

type ImportResult = {
  checkedLinks: number;
  accepted: number;
  rejected: number;
  drafts: Array<{
    name?: string;
    affiliateUrl?: string;
    imageUrl?: string;
    currentPrice?: number;
    rejectionReasons: string[];
    attempts?: Array<{ source: string; ok: boolean; reason?: string }>;
  }>;
  notes: string[];
  attempts?: Array<{ source: string; ok: boolean; reason?: string }>;
  persistence?: { ok: boolean; skipped?: boolean; reason?: string; status?: number; runId?: string };
};

type TelegramDashboardState = {
  configured: boolean;
  intervalMinutes: number;
  sent: number;
  failed: number;
  queued: number;
  lastSentAt: string | null;
  recent: Array<{ productSlug: string; status: string; score: number; postedAt?: string | null; error?: string | null }>;
};

export default function AdminDashboard({
  products,
  supabaseReady,
  supabaseHealth,
  telegram,
}: {
  products: Product[];
  supabaseReady: boolean;
  supabaseHealth: SupabaseHealth;
  telegram: TelegramDashboardState;
}) {
  const router = useRouter();
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [syncResult, setSyncResult] = useState<{ ok: boolean; count?: number; reason?: string; status?: number } | null>(null);
  const [pending, setPending] = useState(false);
  const [syncPending, setSyncPending] = useState(false);
  const [telegramPending, setTelegramPending] = useState(false);
  const [telegramResult, setTelegramResult] = useState<{ ok: boolean; skipped?: boolean; product?: string; reason?: string; messageId?: number } | null>(null);
  const unknownPrices = products.filter((product) => product.price === 0).length;
  const heroProducts = products.slice(0, 5);
  const lastVerified = [...products]
    .map((product) => product.lastVerifiedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  async function importLinks() {
    setPending(true);
    const response = await fetch("/api/dashadmin/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw }),
    });
    const data = await response.json();
    setPending(false);
    setResult(data);
  }

  async function logout() {
    await fetch("/api/dashadmin/logout", { method: "POST" });
    router.replace("/dashadmin/login");
    router.refresh();
  }

  async function syncProducts() {
    setSyncPending(true);
    const response = await fetch("/api/dashadmin/sync-products", { method: "POST" });
    const data = await response.json();
    setSyncPending(false);
    setSyncResult(data);
  }

  async function publishTelegram() {
    setTelegramPending(true);
    const response = await fetch("/api/telegram/publish?force=1");
    const data = await response.json();
    setTelegramPending(false);
    setTelegramResult(data);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#0c1020] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(255,90,31,0.22),transparent_24%),radial-gradient(circle_at_84%_0%,rgba(80,220,160,0.18),transparent_28%),linear-gradient(135deg,#0c1020,#12172c_50%,#080a12)]" />
      <div className="pointer-events-none fixed -left-32 top-12 h-80 w-80 rounded-full border border-white/10" />
      <div className="relative mx-auto grid min-h-screen max-w-[1520px] gap-4 p-3 lg:grid-cols-[230px_1fr] lg:p-7">
        <aside className="rounded-lg border border-white/10 bg-[#111628]/85 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#ff5a1f] text-white shadow-[0_0_35px_rgba(255,90,31,0.45)]">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-black">StartPromos</p>
              <p className="text-xs text-white/45">Cardinal command</p>
            </div>
          </div>
          <nav className="space-y-1 text-sm font-semibold">
            {[
              ["Dashboard", Activity],
              ["Ofertas", Sparkles],
              ["Importar", Upload],
              ["Telegram", Send],
              ["Banco", Database],
              ["Proteção", ShieldCheck],
            ].map(([label, Icon]) => (
              <a key={label as string} href={label === "Telegram" ? "#telegram" : "#importar"} className="flex items-center gap-3 rounded-md px-3 py-2 text-white/58 hover:bg-white/8 hover:text-white">
                <Icon className="h-4 w-4" />
                {label as string}
              </a>
            ))}
          </nav>
          <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffb36b]">Bot público</p>
            <p className="mt-2 text-sm font-bold">{telegram.configured ? "Telegram conectado" : "Aguardando token"}</p>
            <p className="mt-1 text-xs text-white/45">Post a cada {telegram.intervalMinutes} min</p>
          </div>
          <button onClick={logout} className="mt-8 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-white/45 hover:bg-red-500/10 hover:text-red-200">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </aside>

        <main className="space-y-4">
          <section className="overflow-hidden rounded-lg border border-white/10 bg-[#111628]/82 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#ff8a3d]">Painel privado StartPromos</p>
                <h1 className="font-display text-4xl font-black tracking-tight lg:text-5xl">Dashboard Cardinal</h1>
                <p className="mt-1 text-sm text-white/55">Ofertas, bot Telegram, Supabase e varredura contínua sem mexer no código.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={publishTelegram}
                  disabled={telegramPending || !telegram.configured}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#ff5a1f] px-4 text-sm font-extrabold text-white shadow-[0_12px_38px_rgba(255,90,31,0.28)] disabled:cursor-wait disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {telegramPending ? "Enviando" : "Disparar Telegram"}
                </button>
                <button
                  onClick={syncProducts}
                  disabled={syncPending}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 px-4 text-sm font-extrabold text-white disabled:cursor-wait disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  {syncPending ? "Sincronizando" : "Sincronizar catálogo"}
                </button>
              </div>
            </div>
            {syncResult && (
              <p className={`mt-4 rounded-md px-3 py-2 text-xs font-bold ${syncResult.ok ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-400/15 text-amber-200"}`}>
                {syncResult.ok ? `${syncResult.count ?? 0} produtos enviados ao Supabase.` : syncResult.reason || `Falha Supabase ${syncResult.status ?? ""}`}
              </p>
            )}
            {telegramResult && (
              <p className={`mt-4 rounded-md px-3 py-2 text-xs font-bold ${telegramResult.ok ? "bg-sky-400/15 text-sky-200" : "bg-red-400/15 text-red-200"}`}>
                {telegramResult.ok ? `Telegram enviado${telegramResult.product ? ` · ${telegramResult.product}` : ""}` : telegramResult.reason ?? "Falha no Telegram"}
              </p>
            )}
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric label="Produtos publicados" value={products.length.toString()} detail="visíveis no site" tone="orange" icon={Flame} />
            <Metric label="Telegram enviados" value={telegram.sent.toString()} detail={`${telegram.failed} falhas recentes`} tone="blue" icon={Send} />
            <Metric label="Sem preço aberto" value={unknownPrices.toString()} detail="com pop-up de clique" tone="purple" icon={Sparkles} />
            <Metric
              label="Supabase"
              value={supabaseReady ? "ON" : supabaseHealth.configured ? "Schema" : "Pendente"}
              detail={supabaseReady ? "banco pronto" : supabaseHealth.configured ? "tabela não respondeu" : "sem credenciais"}
              tone={supabaseReady ? "green" : "purple"}
              icon={Database}
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div id="importar" className="rounded-lg border border-white/10 bg-[#111628]/82 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-black">Importador Cardinal</h2>
                  <p className="mt-1 text-sm text-white/55">Cole links do TikTok Shop, SHEIN, Shopee e futuros marketplaces. O Cardinal valida, publica e alimenta o bot.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
                  <RefreshCw className="h-3.5 w-3.5" />
                  pronto para cron
                </span>
              </div>
              <textarea
                value={raw}
                onChange={(event) => setRaw(event.target.value)}
                placeholder="Cole aqui os nomes e links..."
                className="min-h-56 w-full resize-y rounded-md border border-white/10 bg-black/25 p-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#ff5a1f]"
              />
              <button onClick={importLinks} disabled={pending || !raw.trim()} className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#ff5a1f] px-5 font-display text-sm font-extrabold text-white hover:bg-[#e64f19] disabled:cursor-not-allowed disabled:opacity-60">
                <Upload className="h-4 w-4" />
                {pending ? "Analisando" : "Analisar links"}
              </button>
              {result && (
                <div className="mt-4 rounded-md border border-white/10 bg-black/18 p-4">
                  <p className="font-display text-lg font-black">{result.checkedLinks} links analisados</p>
                  <p className="mt-1 text-sm text-white/55">{result.accepted} completos · {result.rejected} precisam de enriquecimento</p>
                  {result.persistence && (
                    <p className={`mt-2 rounded-md px-3 py-2 text-xs font-bold ${result.persistence.ok ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-400/15 text-amber-200"}`}>
                      Supabase: {result.persistence.ok ? `salvo${result.persistence.runId ? ` · ${result.persistence.runId}` : ""}` : result.persistence.reason || `erro ${result.persistence.status ?? ""}`}
                    </p>
                  )}
                  <div className="mt-3 max-h-48 space-y-2 overflow-auto pr-2">
                    {result.drafts.map((draft, index) => (
                      <div key={`${draft.affiliateUrl}-${index}`} className="rounded-md bg-white/[0.06] p-3 text-sm">
                        <div className="flex gap-3">
                          {draft.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={draft.imageUrl} alt="" className="h-14 w-14 rounded-md object-cover" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">{draft.name || "Produto sem nome extraído"}</p>
                            {draft.currentPrice && <p className="mt-1 text-xs font-black text-emerald-200">Preço detectado: R$ {draft.currentPrice.toFixed(2).replace(".", ",")}</p>}
                          </div>
                        </div>
                        <p className="break-all text-xs text-white/40">{draft.affiliateUrl}</p>
                        {draft.attempts && draft.attempts.length > 0 && (
                          <p className="mt-1 text-xs text-white/40">
                            Tentativas: {draft.attempts.map((attempt) => `${attempt.source} ${attempt.ok ? "ok" : attempt.reason || "falhou"}`).join(" · ")}
                          </p>
                        )}
                        {draft.rejectionReasons.length > 0 && <p className="mt-1 text-xs font-semibold text-amber-200">{draft.rejectionReasons.join(" · ")}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div id="telegram" className="rounded-lg border border-white/10 bg-[#151b33]/82 p-5 text-white shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-3">
                  <Cloud className="h-5 w-5 text-[#ff8a3d]" />
                  <h2 className="font-display text-2xl font-black">Cardinal 24/7 + Telegram</h2>
                </div>
                <div className="grid grid-cols-8 gap-2" aria-hidden>
                  {Array.from({ length: 40 }).map((_, index) => (
                    <span key={index} className={`h-8 rounded-md ${index % 7 === 0 ? "bg-[#ff5a1f]" : index % 5 === 0 ? "bg-emerald-400" : index % 3 === 0 ? "bg-sky-300/70" : "bg-white/12"}`} />
                  ))}
                </div>
                <p className="mt-4 text-sm text-white/70">Última verificação local: {lastVerified ? new Date(lastVerified).toLocaleString("pt-BR") : "aguardando conexão"}</p>
                <p className="mt-1 text-sm text-white/70">Último post: {telegram.lastSentAt ? new Date(telegram.lastSentAt).toLocaleString("pt-BR") : "ainda não enviado"}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#111628]/82 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <h2 className="font-display text-2xl font-black">Esteira automática</h2>
                <ul className="mt-4 space-y-3 text-sm text-white/58">
                  <li className="flex gap-2"><BadgeCheck className="h-4 w-4 text-emerald-300" /> Vercel Cron chama o Cardinal de hora em hora.</li>
                  <li className="flex gap-2"><BadgeCheck className="h-4 w-4 text-emerald-300" /> Bot publica no Telegram com botão rastreável `/go/produto`.</li>
                  <li className="flex gap-2"><BadgeCheck className="h-4 w-4 text-emerald-300" /> Supabase guarda produtos, posts e cliques.</li>
                </ul>
                {!supabaseReady && supabaseHealth.reason && (
                  <p className="mt-4 max-h-28 overflow-auto rounded-md bg-amber-400/12 p-3 text-xs font-semibold text-amber-200">
                    Supabase ainda não confirmou schema: {supabaseHealth.reason}
                  </p>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-5">
                {heroProducts.map((product) => (
                  <div key={product.slug} className="aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-white/10 bg-[#111628]/82 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <h2 className="font-display text-2xl font-black">Posts recentes</h2>
                <div className="mt-4 space-y-2">
                  {telegram.recent.length === 0 && <p className="text-sm text-white/45">Nenhum post registrado ainda.</p>}
                  {telegram.recent.map((post) => (
                    <div key={`${post.productSlug}-${post.postedAt ?? post.status}`} className="grid grid-cols-[1fr_auto] gap-3 rounded-md bg-white/[0.045] p-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{post.productSlug}</p>
                        <p className="text-xs text-white/45">{post.postedAt ? new Date(post.postedAt).toLocaleString("pt-BR") : post.error ?? "pendente"}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-black uppercase text-white/70">{post.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Metric({ label, value, detail, tone, icon: Icon }: { label: string; value: string; detail: string; tone: "green" | "orange" | "blue" | "purple"; icon: typeof ChartNoAxesCombined }) {
  const style =
    tone === "green" ? "from-emerald-500 to-teal-600" :
    tone === "blue" ? "from-sky-500 to-blue-700" :
    tone === "purple" ? "from-violet-500 to-fuchsia-700" :
    "from-[#ff5a1f] to-[#ffb36b]";
  return (
    <article className={`rounded-lg bg-gradient-to-br ${style} p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-white/80">{label}</p>
        <Icon className="h-7 w-7 text-white/80" />
      </div>
      <p className="mt-4 font-display text-4xl font-black">{value}</p>
      <p className="mt-2 text-sm text-white/72">{detail}</p>
    </article>
  );
}
