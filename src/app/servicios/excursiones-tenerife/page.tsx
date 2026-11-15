import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { getServicio } from "@/lib/servicios";
import { AFILIADO, CATEGORIAS, EXCURSIONES, enlaceAfiliado } from "@/lib/excursiones";

const servicio = getServicio("excursiones-tenerife")!;
const path = `/servicios/${servicio.slug}/`;

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

export default function ExcursionesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Qué hacer en Tenerife</p>
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-volcanic sm:text-4xl">{servicio.title}</h1>
      <p className="mt-3 text-lg text-ink/75">
        Una selección de excursiones y actividades para conocer Tenerife: el Teide, el mar y sus cetáceos, los parques
        y experiencias para todos los gustos.
      </p>

      <div className="mt-6 rounded-xl border-l-4 border-sunset bg-white p-4 text-sm text-ink shadow-sm">
        <strong>Transparencia:</strong> estas excursiones las ofrece nuestro partner{" "}
        <a href={enlaceAfiliado(AFILIADO.web)} target="_blank" rel="sponsored noopener" className="text-ocean underline">
          {AFILIADO.nombre}
        </a>
        , una empresa local de Tenerife inscrita en el Registro General Turístico de Canarias. Los enlaces son de
        afiliado: si reservas, Tenerife Dice recibe una comisión sin coste extra para ti. Precios, horarios y
        disponibilidad, siempre en su web.
      </div>

      {CATEGORIAS.map((c) => {
        const lista = EXCURSIONES.filter((e) => e.categoria === c.id);
        if (lista.length === 0) return null;
        return (
          <section key={c.id} className="mt-10">
            <h2 className="font-display text-2xl font-bold text-volcanic">{c.titulo}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {lista.map((e) => (
                <li key={e.id}>
                  <a
                    href={enlaceAfiliado(e.url)}
                    target="_blank"
                    rel="sponsored noopener"
                    className="flex h-full flex-col rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <span className="font-display text-lg font-bold text-ocean">{e.titulo}</span>
                    <span className="mt-1 flex-1 text-sm text-ink/80">{e.descripcion}</span>
                    <span className="mt-3 text-sm font-semibold text-sunset">Ver precios y disponibilidad →</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <div className="prose-article mt-12">
        <h2>Antes de reservar</h2>
        <ul>
          <li>
            ¿Vas a subir al Teide? Consulta cómo funciona el{" "}
            <Link href="/servicios/permiso-subir-teide/">permiso para llegar al pico</Link> y los{" "}
            <Link href="/servicios/avisos-aemet-tenerife/">avisos meteorológicos</Link>: en invierno las cumbres pueden
            cerrar por hielo o viento.
          </li>
          <li>
            Para las salidas en barco, mira el <Link href="/servicios/playas-tenerife-hoy/">estado del mar de hoy</Link>.
          </li>
          <li>
            Si llegas sin coche, revisa <Link href="/servicios/guaguas-aeropuertos-tenerife/">qué guagua coger desde el
            aeropuerto</Link>.
          </li>
        </ul>
      </div>
    </div>
  );
}
