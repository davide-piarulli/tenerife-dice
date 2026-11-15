import { getAllArticles } from "@/lib/articles";
import type { Article } from "@/types/article";

export type ZonaMunicipio = "Área metropolitana" | "Norte" | "Sur" | "Oeste" | "Este";

export type Municipio = {
  slug: string;
  nombre: string;
  zona: ZonaMunicipio;
  /** Matches the municipality or its best-known places in a news text. */
  patron: RegExp;
};

// The 31 municipalities of Tenerife. Patterns include well-known towns inside each one.
export const MUNICIPIOS: Municipio[] = [
  { slug: "santa-cruz-de-tenerife", nombre: "Santa Cruz de Tenerife", zona: "Área metropolitana", patron: /santa cruz(?! de la palma)\b|las teresitas|san andrés\b|anaga/i },
  { slug: "la-laguna", nombre: "San Cristóbal de La Laguna", zona: "Área metropolitana", patron: /la laguna|lagunero|lagunera|tejina|bajamar|punta del hidalgo/i },
  { slug: "el-rosario", nombre: "El Rosario", zona: "Área metropolitana", patron: /el rosario\b|radazul|tabaiba/i },
  { slug: "tegueste", nombre: "Tegueste", zona: "Área metropolitana", patron: /tegueste/i },
  { slug: "tacoronte", nombre: "Tacoronte", zona: "Norte", patron: /tacoronte/i },
  { slug: "el-sauzal", nombre: "El Sauzal", zona: "Norte", patron: /el sauzal/i },
  { slug: "la-matanza-de-acentejo", nombre: "La Matanza de Acentejo", zona: "Norte", patron: /la matanza/i },
  { slug: "la-victoria-de-acentejo", nombre: "La Victoria de Acentejo", zona: "Norte", patron: /la victoria de acentejo/i },
  { slug: "santa-ursula", nombre: "Santa Úrsula", zona: "Norte", patron: /santa úrsula|santa ursula/i },
  { slug: "la-orotava", nombre: "La Orotava", zona: "Norte", patron: /la orotava|orotavense/i },
  { slug: "puerto-de-la-cruz", nombre: "Puerto de la Cruz", zona: "Norte", patron: /puerto de la cruz|loro parque|lago martiánez|lago martianez/i },
  { slug: "los-realejos", nombre: "Los Realejos", zona: "Norte", patron: /los realejos|realejero/i },
  { slug: "san-juan-de-la-rambla", nombre: "San Juan de la Rambla", zona: "Norte", patron: /san juan de la rambla/i },
  { slug: "la-guancha", nombre: "La Guancha", zona: "Norte", patron: /la guancha/i },
  { slug: "icod-de-los-vinos", nombre: "Icod de los Vinos", zona: "Norte", patron: /icod/i },
  { slug: "garachico", nombre: "Garachico", zona: "Norte", patron: /garachico/i },
  { slug: "el-tanque", nombre: "El Tanque", zona: "Norte", patron: /el tanque\b/i },
  { slug: "los-silos", nombre: "Los Silos", zona: "Norte", patron: /los silos/i },
  { slug: "buenavista-del-norte", nombre: "Buenavista del Norte", zona: "Norte", patron: /buenavista del norte|punta de teno|\bteno\b/i },
  { slug: "santiago-del-teide", nombre: "Santiago del Teide", zona: "Oeste", patron: /santiago del teide|los gigantes|puerto de santiago|\bmasca\b/i },
  { slug: "guia-de-isora", nombre: "Guía de Isora", zona: "Oeste", patron: /guía de isora|guia de isora|playa san juan/i },
  { slug: "adeje", nombre: "Adeje", zona: "Sur", patron: /adeje|siam park|fañabé|fanabe/i },
  { slug: "arona", nombre: "Arona", zona: "Sur", patron: /arona|los cristianos|las américas|las americas|las galletas|el fraile/i },
  { slug: "san-miguel-de-abona", nombre: "San Miguel de Abona", zona: "Sur", patron: /san miguel de abona|golf del sur|amarilla golf/i },
  { slug: "vilaflor", nombre: "Vilaflor de Chasna", zona: "Sur", patron: /vilaflor/i },
  { slug: "granadilla-de-abona", nombre: "Granadilla de Abona", zona: "Sur", patron: /granadilla|el médano|el medano|los abrigos|aeropuerto (de )?tenerife sur|aeropuerto del sur/i },
  { slug: "arico", nombre: "Arico", zona: "Sur", patron: /\barico\b|poris de abona/i },
  { slug: "fasnia", nombre: "Fasnia", zona: "Este", patron: /fasnia/i },
  { slug: "guimar", nombre: "Güímar", zona: "Este", patron: /güímar|guimar|puertito de güímar/i },
  { slug: "arafo", nombre: "Arafo", zona: "Este", patron: /arafo/i },
  { slug: "candelaria", nombre: "Candelaria", zona: "Este", patron: /candelaria|caletillas|igueste de candelaria/i },
];

export const ZONAS: ZonaMunicipio[] = ["Área metropolitana", "Norte", "Sur", "Oeste", "Este"];

/** Only municipalities with at least this many articles get a page (avoid thin pages). */
export const MIN_ARTICULOS = 3;

function textoArticulo(a: Article): string {
  const cuerpo = a.content.replace(/<[^>]+>/g, " ").slice(0, 800);
  return [a.title, a.excerpt, ...(a.tags ?? []), cuerpo].join(" ");
}

export function municipiosDeTexto(texto: string): Municipio[] {
  return MUNICIPIOS.filter((m) => m.patron.test(texto));
}

export function municipiosDeArticulo(a: Article): Municipio[] {
  return municipiosDeTexto(textoArticulo(a));
}

export function getMunicipio(slug: string) {
  return MUNICIPIOS.find((m) => m.slug === slug);
}

/** Articles per municipality, newest first. */
let cache: Promise<Map<string, Article[]>> | null = null;

export function getArticulosPorMunicipio(): Promise<Map<string, Article[]>> {
  cache ??= construirMapa();
  return cache;
}

async function construirMapa(): Promise<Map<string, Article[]>> {
  const mapa = new Map<string, Article[]>();
  for (const a of await getAllArticles()) {
    for (const m of municipiosDeArticulo(a)) {
      const lista = mapa.get(m.slug) ?? [];
      lista.push(a);
      mapa.set(m.slug, lista);
    }
  }
  return mapa;
}

/** Municipalities that have their own page. */
export async function getMunicipiosConPagina(): Promise<{ m: Municipio; total: number }[]> {
  const mapa = await getArticulosPorMunicipio();
  return MUNICIPIOS.map((m) => ({ m, total: mapa.get(m.slug)?.length ?? 0 })).filter((x) => x.total >= MIN_ARTICULOS);
}
