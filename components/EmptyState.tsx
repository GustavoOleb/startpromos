import Link from "next/link";

export default function EmptyState({ title, copy, href, cta }: { title: string; copy: string; href?: string; cta?: string }) {
  return (
    <div className="border border-dashed border-white/15 px-6 py-16 text-center">
      <p className="text-[11px] uppercase tracking-[0.2em] text-signal">Radar</p>
      <h2 className="mt-3 font-display text-3xl font-black">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-mist">{copy}</p>
      {href && cta ? (
        <Link href={href} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-signal px-5 font-display text-sm font-bold text-void">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}
