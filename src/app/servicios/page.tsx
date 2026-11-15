import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bus,
  Car,
  CloudSun,
  Compass,
  Mountain,
  PartyPopper,
  Umbrella,
  type LucideIcon,
} from "lucide-react";
import { AvisosResumen } from "@/components/AvisosResumen";
import { getServicio, SERVICIOS } from "@/lib/servicios";
import { getPlayas, resumir } from "@/lib/playas";

export const metadata: Metadata = {
  title: "Servicios útiles en Tenerife",
  description:
    "Información práctica para Tenerife en un solo sitio: playas hoy, avisos de AEMET, carreteras, guaguas desde el aeropuerto, permiso del Teide, Carnaval y excursiones.",
  alternates: { canonical: "/servicios/" },
};

const ICONOS: Record<string, LucideIcon> = {
  "playas-tenerife-hoy": Umbrella,
  "avisos-aemet-tenerife": CloudSun,
  "estado-carreteras-tenerife": Car,
  "guaguas-aeropuertos-tenerife": Bus,
  "permiso-subir-teide": Mountain,
  "carnaval-santa-cruz-tenerife-2027": PartyPopper,
  "excursiones-tenerife": Compass,
};

const PLANIFICA = [
  "permiso-subir-teide",
  "guaguas-aeropuertos-tenerife",
  "excursiones-tenerife",
  "carnaval-santa-cruz-tenerife-2027",
];

function TarjetaHoy({
  slug,
  children,
  acento,
}: {
  slug: string;
  children: React.ReactNode;
  acento: string;
}) {
  const s = getServicio(slug)!;
  const Icono = ICONOS[slug];
  return (
    <Link
      href={`/servicios/${slug}/`}
      className="group flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-ocean"
    >
      <span className="flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${acento}`}>
          <Icono className="h-5 w-5" aria-hidden />
        </span>
        <span className="font-display text-lg font-bold text-volcanic">{s.short}</span>
      </span>
      <span className="mt-4 flex-1 text-sm">{children}</span>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ocean group-hover:gap-2">
        Ver detalle <ArrowRight className="h-4 w-4 transition-all" aria-hidden />
      </span>
    </Link>
  );
}

export default async function ServiciosPage() {
  const resumen = resumir(await getPlayas());

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Tenerife práctico</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-volcanic sm:text-4xl">Servicios útiles en Tenerife</h1>
      <p className="mt-2 text-lg text-ink/75">Lo que conviene mirar antes de salir de casa, en un solo sitio.</p>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-volcanic">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sunset opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sunset" />
          </span>
          Hoy en Tenerife
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <TarjetaHoy slug="playas-tenerife-hoy" acento="bg-sky-100 text-sky-700">
            {resumen && resumen.mejores.length > 0 ? (
              <>
                <span className="font-semibold text-volcanic">Buenas para hoy:</span>
                <span className="mt-1 block text-ink/80">
                  {resumen.mejores
                    .slice(0, 3)
                    .map((p) => p.nombre)
                    .join(" · ")}
                </span>
                {resumen.evitar > 0 && (
                  <span className="mt-2 block text-xs text-muted">
                    {resumen.evitar} {resumen.evitar === 1 ? "playa" : "playas"} con mar o viento fuerte
                  </span>
                )}
              </>
            ) : (
              <span className="text-ink/75">Oleaje, viento y webcams de 21 playas de la isla.</span>
            )}
          </TarjetaHoy>
          <TarjetaHoy slug="avisos-aemet-tenerife" acento="bg-amber-100 text-amber-700">
            <AvisosResumen />
            <span className="mt-2 block text-xs text-muted">Datos de AEMET, comprobados al abrir la página.</span>
          </TarjetaHoy>
          <TarjetaHoy slug="estado-carreteras-tenerife" acento="bg-rose-100 text-rose-700">
            <span className="text-ink/80">Tráfico en directo, cámaras de la TF-1 y TF-5 y cierres de los accesos al Teide.</span>
          </TarjetaHoy>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-volcanic">Planifica tu visita</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {PLANIFICA.map((slug) => {
            const s = SERVICIOS.find((x) => x.slug === slug)!;
            const Icono = ICONOS[slug];
            return (
              <li key={slug}>
                <Link
                  href={`/servicios/${slug}/`}
                  className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:ring-ocean"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                    <Icono className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-volcanic group-hover:text-ocean">{s.short}</span>
                    <span className="block text-sm text-ink/70">{s.util}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-ocean" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
