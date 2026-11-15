import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bus, CloudSun, Mountain, Waves } from "lucide-react";
import { SITE } from "@/lib/constants";
import { getServicio } from "@/lib/servicios";
import { AFILIADO, DESTACADAS, EXCURSIONES, enlaceAfiliado, getExcursiones } from "@/lib/excursiones";
import { ExcursionesExplorer, TarjetaExcursion } from "@/components/ExcursionesExplorer";

const servicio = getServicio("excursiones-tenerife")!;
const path = `/servicios/${servicio.slug}/`;

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

const CONSEJOS = [
  {
    icono: Mountain,
    titulo: "¿Subes al pico del Teide?",
    texto: "El teleférico no incluye el permiso para el último tramo.",
    enlace: "/servicios/permiso-subir-teide/",
    cta: "Cómo conseguir el permiso",
  },
  {
    icono: CloudSun,
    titulo: "Mira el tiempo antes",
    texto: "En invierno las cumbres pueden cerrar por hielo o viento.",
    enlace: "/servicios/avisos-aemet-tenerife/",
    cta: "Avisos de AEMET",
  },
  {
    icono: Waves,
    titulo: "¿Sales en barco?",
    texto: "Consulta el oleaje y el viento de la costa para hoy.",
    enlace: "/servicios/playas-tenerife-hoy/",
    cta: "Estado del mar hoy",
  },
  {
    icono: Bus,
    titulo: "¿Llegas sin coche?",
    texto: "Qué guagua coger desde cada aeropuerto.",
    enlace: "/servicios/guaguas-aeropuertos-tenerife/",
    cta: "Guaguas del aeropuerto",
  },
];

export default function ExcursionesPage() {
  const destacadas = getExcursiones(DESTACADAS);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-3xl bg-volcanic">
        <Image
          src="/images/excursiones/teide-quad.webp"
          alt="Paisaje volcánico del Teide"
          fill
          priority
          sizes="(min-width: 1152px) 1104px, 100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-volcanic via-volcanic/50 to-transparent" />
        <div className="relative px-6 pb-8 pt-28 sm:px-10 sm:pb-12 sm:pt-44">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Qué hacer en Tenerife</p>
          <h1 className="mt-2 max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            {servicio.title}
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/85 sm:text-lg">
            El Teide, el mar y sus cetáceos, los parques y experiencias para todos los gustos, con una empresa local de
            la isla.
          </p>
          <a
            href="#todas"
            className="mt-6 inline-flex rounded-full bg-sunset px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-sunset-dark"
          >
            Ver las {EXCURSIONES.length} excursiones
          </a>
        </div>
      </header>

      <p className="mt-3 text-center text-xs text-muted">
        Enlaces de afiliado de nuestro partner local {AFILIADO.nombre}.{" "}
        <a href="#transparencia" className="underline">Más información</a>
      </p>

      {/* Featured */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-volcanic sm:text-3xl">Las más pedidas</h2>
        <p className="mt-1 text-ink/70">Tres clásicos que no fallan en una primera visita.</p>
        <ul className="mt-5 grid gap-5 md:grid-cols-3">
          {destacadas.map((e) => (
            <li key={e.id}>
              <TarjetaExcursion e={e} grande />
            </li>
          ))}
        </ul>
      </section>

      <ExcursionesExplorer />

      {/* Tips */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold text-volcanic sm:text-3xl">Antes de reservar</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONSEJOS.map(({ icono: Icono, ...c }) => (
            <li key={c.enlace}>
              <Link
                href={c.enlace}
                className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:ring-ocean"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                  <Icono className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-3 font-semibold text-volcanic">{c.titulo}</span>
                <span className="mt-1 flex-1 text-sm text-ink/75">{c.texto}</span>
                <span className="mt-3 text-sm font-semibold text-ocean">{c.cta} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Disclosure */}
      <p id="transparencia" className="mt-12 rounded-2xl bg-sand-dark/60 p-4 text-xs leading-relaxed text-muted">
        <strong className="text-ink">Transparencia:</strong> estas excursiones las ofrece nuestro partner{" "}
        <a href={enlaceAfiliado(AFILIADO.web)} target="_blank" rel="sponsored noopener" className="text-ocean underline">
          {AFILIADO.nombre}
        </a>
        , una empresa local de Tenerife inscrita en el Registro General Turístico de Canarias. Los enlaces son de
        afiliado: si reservas, {SITE.name} recibe una comisión sin coste extra para ti. Precios, horarios y
        disponibilidad, siempre en su web. Fotos: {AFILIADO.nombre}, salvo indicación.
      </p>
    </div>
  );
}
