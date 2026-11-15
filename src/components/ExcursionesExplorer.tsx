"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIAS, EXCURSIONES, enlaceAfiliado, imagenExcursion, type CategoriaExcursion, type Excursion } from "@/lib/excursiones";

const nombreCategoria = (id: CategoriaExcursion) => CATEGORIAS.find((c) => c.id === id)?.corto ?? "";

export function TarjetaExcursion({ e, grande = false }: { e: Excursion; grande?: boolean }) {
  return (
    <a
      href={enlaceAfiliado(e.url)}
      target="_blank"
      rel="sponsored noopener"
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <span className={`relative block overflow-hidden ${grande ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
        <Image
          src={imagenExcursion(e)}
          alt={e.titulo}
          fill
          sizes={grande ? "(min-width: 768px) 300px, 100vw" : "(min-width: 1024px) 300px, (min-width: 640px) 45vw, 100vw"}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ocean backdrop-blur">
          {nombreCategoria(e.categoria)}
        </span>
        {e.etiqueta && (
          <span className="absolute bottom-3 left-3 rounded-full bg-sunset px-2.5 py-1 text-xs font-semibold text-white">
            {e.etiqueta}
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col p-4">
        <span className="font-display text-lg font-bold leading-snug text-volcanic group-hover:text-ocean">{e.titulo}</span>
        <span className="mt-1.5 flex-1 text-sm leading-relaxed text-ink/75">{e.descripcion}</span>
        {e.credito && <span className="mt-2 text-[10px] text-muted">{e.credito}</span>}
        <span className="mt-4 inline-flex items-center justify-center gap-1 rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-sunset">
          Ver precios y reservar <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </span>
    </a>
  );
}

/** Category filter chips + grid of excursion cards. */
export function ExcursionesExplorer() {
  const [filtro, setFiltro] = useState<CategoriaExcursion | "todas">("todas");
  const lista = filtro === "todas" ? EXCURSIONES : EXCURSIONES.filter((e) => e.categoria === filtro);

  const chip = (id: CategoriaExcursion | "todas", texto: string, n: number) => {
    const activo = filtro === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => setFiltro(id)}
        aria-pressed={activo}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
          activo ? "bg-volcanic text-white shadow" : "bg-white text-ink ring-1 ring-black/10 hover:ring-ocean"
        }`}
      >
        {texto} <span className={activo ? "text-white/60" : "text-muted"}>{n}</span>
      </button>
    );
  };

  return (
    <section id="todas" className="mt-12 scroll-mt-20">
      <h2 className="font-display text-2xl font-bold text-volcanic sm:text-3xl">¿Qué te apetece hacer?</h2>
      <div className="-mx-4 mt-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {chip("todas", "Todas", EXCURSIONES.length)}
          {CATEGORIAS.map((c) => chip(c.id, c.corto, EXCURSIONES.filter((e) => e.categoria === c.id).length))}
        </div>
      </div>
      <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((e) => (
          <li key={e.id}>
            <TarjetaExcursion e={e} />
          </li>
        ))}
      </ul>
    </section>
  );
}
