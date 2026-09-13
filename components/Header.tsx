"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bookmark, Menu, Search, X } from "lucide-react";
import type { NavItem } from "@/lib/products";
import { useFavorites } from "@/hooks/useFavorites";
import { useScrolled } from "@/hooks/useMotion";
import SearchOverlay from "@/components/SearchOverlay";

export default function Header({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const scrolled = useScrolled(12);
  const { count } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
      if (event.key === "/" && !event.metaKey && !event.ctrlKey) {
        const target = event.target as HTMLElement | null;
        if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  if (pathname.startsWith("/dashadmin")) return null;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-[background,border-color,backdrop-filter] duration-300 ${
          scrolled || menuOpen
            ? "border-b border-white/10 bg-void/90 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="StartPromos — início">
            <Image src="/starticon.png" alt="" width={28} height={28} className="rounded-sm" priority />
            <span className="font-display text-[15px] font-extrabold tracking-tight">
              Start<span className="text-signal">Promos</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                    active ? "text-fog" : "text-mute hover:text-fog"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-mist hover:text-fog"
              aria-label="Buscar ofertas"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="/salvos"
              className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-mist hover:text-fog"
              aria-label={`Meus achados${count ? `, ${count} salvos` : ""}`}
            >
              <Bookmark className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-signal" aria-hidden />
              )}
            </Link>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-fog lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile"
            className="flex flex-col gap-1 border-t border-white/10 bg-void px-4 py-4 lg:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-lg font-medium text-fog"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <SearchOverlay key={searchOpen ? "open" : "closed"} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
