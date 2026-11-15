import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getMunicipiosConPagina, ZONAS } from "@/lib/municipios";

export const metadata: Metadata = {
  title: "Noticias por municipio de Tenerife",
  description: "Noticias de Tenerife ordenadas por municipio: Santa Cruz, La Laguna, Puerto de la Cruz, Arona, Adeje, Granadilla, Candelaria y más.",
  alternates: { canonical: "/municipios/" },
};

export default async function MunicipiosPage() {
  const lista = await getMunicipiosConPagina();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-volcanic">Noticias por municipio</h1>
      <p className="mt-2 text-lg text-ink/75">Elige tu municipio y lee solo lo que pasa cerca de ti.</p>
      {ZONAS.map((z) => {
        const deZona = lista.filter((x) => x.m.zona === z);
        if (deZona.length === 0) return null;
        return (
          <section key={z} className="mt-8">
            <h2 className="font-display text-xl font-bold text-volcanic">{z}</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {deZona.map(({ m, total }) => (
                <li key={m.slug}>
                  <Link
                    href={`/municipio/${m.slug}/`}
                    className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:ring-ocean"
                  >
                    <MapPin className="h-5 w-5 shrink-0 text-sunset" aria-hidden />
                    <span className="flex-1 font-semibold text-volcanic">{m.nombre}</span>
                    <span className="text-sm text-muted">{total} noticias</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
