"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FOOTER_INFO, SITE } from "@/lib/site";
import type { NavItem } from "@/lib/products";

export default function Footer({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();

  if (pathname.startsWith("/dashadmin")) return null;

  return (
    <footer className="mt-8 border-t border-white/10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/starticon.png" alt="" width={22} height={22} className="rounded-sm" />
            <p className="font-display text-sm font-extrabold">StartPromos</p>
          </div>
          <p className="mt-3 max-w-xs text-sm text-mute">{SITE.tagline}</p>
        </div>
        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-8 text-sm">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-mist hover:text-fog">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {FOOTER_INFO.map((item) => (
              <Link key={item.href} href={item.href} className="text-mist hover:text-fog">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-mute sm:px-6">
        © {new Date().getFullYear()} StartPromos. Ofertas encontradas e comparadas pelo Cardinal.
      </div>
    </footer>
  );
}
