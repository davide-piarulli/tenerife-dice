import { getAllArticles } from "@/lib/articles";
import type { Article } from "@/types/article";

export type Servicio = {
  slug: string;
  title: string;
  short: string;
  description: string;
  /** One-line "what it's for", shown on the services hub. */
  util: string;
};

export const SERVICIOS: Servicio[] = [
  {
    slug: "que-hacer-fin-de-semana-tenerife",
    util: "Planes, carreras y eventos de viernes a domingo.",
    title: "Qué hacer este fin de semana en Tenerife: agenda de planes y eventos",
    short: "Agenda del fin de semana",
    description:
      "Planes para este fin de semana en Tenerife: eventos deportivos, carreras populares, fiestas y actividades de viernes a domingo, con horarios y lugares. Actualizado cada día.",
  },
  {
    slug: "excursiones-tenerife",
    util: "Teide, cetáceos, parques y aventura con una empresa local.",
    title: "Excursiones en Tenerife: qué hacer en la isla",
    short: "Excursiones",
    description:
      "Las mejores excursiones y actividades en Tenerife: Teide en quad o teleférico, avistamiento de cetáceos, kayak, Siam Park, Loro Parque y más, con una empresa local.",
  },
  {
    slug: "playas-tenerife-hoy",
    util: "Oleaje, viento y webcams: a qué playa ir hoy.",
    title: "Playas de Tenerife hoy: estado del mar, viento y webcams",
    short: "Playas hoy",
    description:
      "¿A qué playa ir hoy en Tenerife? Oleaje, viento, temperatura del agua e índice UV en las playas del sur, norte, este y oeste según AEMET, con webcams en directo.",
  },
  {
    slug: "carnaval-santa-cruz-tenerife-2027",
    util: "Fechas, galas, Coso y entradas del próximo Carnaval.",
    title: "Carnaval de Santa Cruz de Tenerife 2027: fechas, programa y entradas",
    short: "Carnaval 2027",
    description:
      "Fechas del Carnaval de Santa Cruz de Tenerife 2027 (tema «Roma Eterna»): galas, concurso de murgas, Gala de la Reina, Carnaval de Día, Coso y cómo comprar entradas.",
  },
  {
    slug: "guaguas-aeropuertos-tenerife",
    util: "Qué línea coger al aterrizar en el Sur o el Norte.",
    title: "Cómo ir de los aeropuertos de Tenerife en guagua: líneas de TITSA",
    short: "Guaguas desde los aeropuertos",
    description:
      "Qué guagua coger desde el aeropuerto Tenerife Sur y Tenerife Norte a Santa Cruz, La Laguna, Puerto de la Cruz, Los Cristianos o Costa Adeje: líneas de TITSA, horarios y billetes.",
  },
  {
    slug: "permiso-subir-teide",
    util: "Cómo reservar el pico, precio de la ecotasa y alternativas.",
    title: "Permiso para subir al Teide en 2026: cómo reservar, precio y alternativas",
    short: "Permiso para subir al Teide",
    description:
      "Cómo conseguir el permiso para subir al pico del Teide en 2026: reserva en Tenerife ON, ecotasa (15 €, gratis para residentes), horarios, normas y cómo subir sin permiso desde el Refugio de Altavista.",
  },
  {
    slug: "avisos-aemet-tenerife",
    util: "Viento, lluvia, calima y costeros por zonas, en directo.",
    title: "Avisos de AEMET hoy en Tenerife",
    short: "Avisos meteorológicos",
    description:
      "Avisos meteorológicos de AEMET vigentes hoy en Tenerife por zonas (norte, sur, cumbres y área metropolitana): viento, lluvia, calima, costeros. Actualizado en tiempo real.",
  },
  {
    slug: "estado-carreteras-tenerife",
    util: "Tráfico, cámaras de la TF-1 y TF-5 y cierres al Teide.",
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

const REGLAS_SERVICIO: { slug: string; patron: RegExp; texto: string }[] = [
  {
    slug: "carnaval-santa-cruz-tenerife-2027",
    patron: /carnaval|murgas?\b|comparsas?\b|reina del carnaval/i,
    texto: "Fechas, programa y entradas del Carnaval de Santa Cruz de Tenerife 2027.",
  },
  {
    slug: "guaguas-aeropuertos-tenerife",
    patron: /aeropuerto|titsa|guaguas?\b/i,
    texto: "Qué guagua coger desde los aeropuertos Tenerife Sur y Norte: líneas, horarios y billetes.",
  },
  {
    slug: "avisos-aemet-tenerife",
    patron: /\baemet\b|aviso (amarillo|naranja|rojo)|lluvias?\b|viento|calima|borrasca|temporal|tormenta|oleaje|prealerta/i,
    texto: "Consulta en tiempo real los avisos meteorológicos de AEMET para cada zona de Tenerife.",
  },
  {
    slug: "permiso-subir-teide",
    patron: /\bteide\b|las cañadas|teleférico|altavista/i,
    texto: "Cómo reservar el permiso para subir al pico del Teide, precios de la ecotasa y alternativas.",
  },
  {
    slug: "estado-carreteras-tenerife",
    patron: /\bTF-\d|tráfico|carretera|atasco|retenciones|guaguas?\b|tranvía|autopista/i,
    texto: "Dónde ver el tráfico en tiempo real, cámaras de la TF-1 y la TF-5 y cierres de carreteras.",
  },
  {
    slug: "playas-tenerife-hoy",
    patron: /\bplayas?\b|bañistas?|socorrista|bandera azul|litoral/i,
    texto: "Estado del mar, viento y webcams de las playas de Tenerife, actualizado cada día.",
  },
  {
    slug: "que-hacer-fin-de-semana-tenerife",
    patron: /fin de semana|romería|romeria|fiestas? (patronales|de)|concierto|festival|carrera popular|trail/i,
    texto: "Más planes para este fin de semana en Tenerife, con horarios y lugares.",
  },
];

/** Service page most related to an article (first matching rule wins), if any. */
export function servicioRelacionado(texto: string): (Servicio & { texto: string }) | null {
  for (const r of REGLAS_SERVICIO) {
    if (r.patron.test(texto)) {
      const s = getServicio(r.slug);
      if (s) return { ...s, texto: r.texto };
    }
  }
  return null;
}
