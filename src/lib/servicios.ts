import { getAllArticles } from "@/lib/articles";
import type { Article } from "@/types/article";

export type Servicio = {
  slug: string;
  title: string;
  short: string;
  description: string;
};

export const SERVICIOS: Servicio[] = [
  {
    slug: "playas-tenerife-hoy",
    title: "Playas de Tenerife hoy: estado del mar, viento y webcams",
    short: "Playas hoy",
    description:
      "¿A qué playa ir hoy en Tenerife? Oleaje, viento, temperatura del agua e índice UV en las playas del sur, norte, este y oeste según AEMET, con webcams en directo.",
  },
  {
    slug: "permiso-subir-teide",
    title: "Permiso para subir al Teide en 2026: cómo reservar, precio y alternativas",
    short: "Permiso para subir al Teide",
    description:
      "Cómo conseguir el permiso para subir al pico del Teide en 2026: reserva en Tenerife ON, ecotasa (15 €, gratis para residentes), horarios, normas y cómo subir sin permiso desde el Refugio de Altavista.",
  },
  {
    slug: "avisos-aemet-tenerife",
    title: "Avisos de AEMET hoy en Tenerife",
    short: "Avisos meteorológicos",
    description:
      "Avisos meteorológicos de AEMET vigentes hoy en Tenerife por zonas (norte, sur, cumbres y área metropolitana): viento, lluvia, calima, costeros. Actualizado en tiempo real.",
  },
  {
    slug: "estado-carreteras-tenerife",
    title: "Estado de las carreteras de Tenerife: TF-1, TF-5 y accesos al Teide",
    short: "Estado de las carreteras",
    description:
      "Dónde consultar el estado del tráfico en Tenerife en tiempo real, cámaras de la TF-1 y la TF-5, cierres de accesos al Teide, obras en curso y últimas noticias de carreteras.",
  },
];

export function getServicio(slug: string) {
  return SERVICIOS.find((s) => s.slug === slug);
}

/** Latest articles whose title, excerpt or tags match the pattern. */
export async function getArticulosRelacionados(
  pattern: RegExp,
  limit = 6,
): Promise<Article[]> {
  const all = await getAllArticles();
  return all
    .filter((a) => pattern.test([a.title, a.excerpt, ...(a.tags ?? [])].join(" ")))
    .slice(0, limit);
}
