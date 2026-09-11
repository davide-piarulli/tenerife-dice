"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/constants";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-sand/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo showTagline />

        <nav className="hidden items-center gap-6 lg:flex">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="text-sm font-semibold text-ink/80 transition hover:text-ocean"
            >
              {cat.label}
            </Link>
          ))}
          <Link
            href="/buscar"
            aria-label="Buscar"
            className="text-ink/70 transition hover:text-ocean"
          >
            <Search size={19} />
          </Link>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <Link href="/buscar" aria-label="Buscar" className="p-2 text-ink">
            <Search size={22} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-ink"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-black/5 bg-sand px-4 pb-4 lg:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/categoria/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2 text-sm font-semibold text-ink/80 hover:bg-black/5 hover:text-ocean"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
