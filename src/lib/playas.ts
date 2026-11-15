// Beach forecasts from AEMET's public per-beach XML (reuse allowed citing AEMET).
// Fetched at build time; the deploy workflow also rebuilds on a schedule so data stays fresh.

export type Zona = "sur" | "norte" | "este" | "oeste";

/** skylineId: SkylineWebcams official embed (linked snapshot image), used unmodified as their terms allow. */
export type Webcam = { url: string; proveedor: string; titulo: string; skylineId?: number };

const SKY = "https://www.skylinewebcams.com/es/webcam/espana/canarias/santa-cruz-de-tenerife/";
const sky = (pagina: string, id: number, titulo: string): Webcam => ({
  url: `${SKY}${pagina}.html`,
  proveedor: "SkylineWebcams",
  titulo,
  skylineId: id,
});

export type PlayaInfo = {
  id: string;
  nombre: string;
  municipio: string;
  zona: Zona;
  webcam?: Webcam;
};

export const PLAYAS: PlayaInfo[] = [
  { id: "3803806", nombre: "Las Teresitas", municipio: "Santa Cruz de Tenerife", zona: "este" },
  { id: "3803801", nombre: "La Nea (Radazul)", municipio: "El Rosario", zona: "este" },
  { id: "3801103", nombre: "La Hornilla - Los Guanches", municipio: "Candelaria", zona: "este", webcam: sky("candelaria-playa-de-las-caletillas", 2775, "Las Caletillas (Candelaria)") },
  { id: "3802002", nombre: "El Puertito", municipio: "Güímar", zona: "este" },
  { id: "3800504", nombre: "Poris", municipio: "Arico", zona: "sur" },
  { id: "3801705", nombre: "El Médano", municipio: "Granadilla de Abona", zona: "sur", webcam: sky("playa-de-el-medano", 376, "Playa de El Médano") },
  { id: "3800603", nombre: "Las Vistas (Los Cristianos)", municipio: "Arona", zona: "sur", webcam: sky("playa-las-vistas", 339, "Playa de Las Vistas") },
  { id: "3800116", nombre: "Las Américas", municipio: "Adeje", zona: "sur", webcam: sky("playa-de-las-americas", 1115, "Playa de las Américas") },
  { id: "3800112", nombre: "Fañabe", municipio: "Adeje", zona: "sur", webcam: sky("playa-de-fanabe", 383, "Playa de Fañabé") },
  { id: "3801905", nombre: "San Juan", municipio: "Guía de Isora", zona: "oeste", webcam: sky("guia-de-isora", 3033, "Playa San Juan (Guía de Isora)") },
  { id: "3804004", nombre: "La Arena (Puerto Santiago)", municipio: "Santiago del Teide", zona: "oeste", webcam: sky("santiago-del-teide-puerto-de-santiago", 4590, "Puerto de Santiago") },
  { id: "3801503", nombre: "El Caletón", municipio: "Garachico", zona: "norte", webcam: sky("garachico", 1000, "Piscinas naturales de Garachico") },
  { id: "3802201", nombre: "San Marcos", municipio: "Icod de los Vinos", zona: "norte" },
  { id: "3803401", nombre: "Las Aguas", municipio: "San Juan de la Rambla", zona: "norte" },
  { id: "3803101", nombre: "El Socorro", municipio: "Los Realejos", zona: "norte", webcam: { url: "https://losrealejos.es/turismo/webcam-municipal/", proveedor: "Ayuntamiento de Los Realejos", titulo: "Webcam municipal de El Socorro" } },
  { id: "3802801", nombre: "Playa Jardín", municipio: "Puerto de la Cruz", zona: "norte", webcam: sky("punta-brava", 1276, "Punta Brava y Playa Jardín") },
  { id: "3802804", nombre: "Martiánez", municipio: "Puerto de la Cruz", zona: "norte", webcam: sky("puerto-de-la-cruz-lago-martianez", 1042, "Lago Martiánez") },
  { id: "3802601", nombre: "El Bollullo", municipio: "La Orotava", zona: "norte" },
  { id: "3802501", nombre: "El Caletón", municipio: "La Matanza de Acentejo", zona: "norte" },
  { id: "3804101", nombre: "La Garañona", municipio: "El Sauzal", zona: "norte" },
  { id: "3804302", nombre: "La Arena (Mesa del Mar)", municipio: "Tacoronte", zona: "norte" },
];

export type Franja = { cielo: string; viento: string; oleaje: string };

export type DiaPlaya = {
  fecha: string; // YYYY-MM-DD
  manana: Franja;
  tarde: Franja;
  tMax?: number;
  tAgua?: number;
  uvMax?: number;
  sensacion?: string;
};

export type Veredicto = "bueno" | "regular" | "malo";

export type Playa = PlayaInfo & {
  dias: DiaPlaya[];
  elaborado?: string;
};

function attr(tag: string, name: string): string {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1].trim() : "";
}

function parseDia(bloque: string, fecha: string): DiaPlaya {
  const tag = (n: string) => bloque.match(new RegExp(`<${n}\\b[^>]*/?>`))?.[0] ?? "";
  const cielo = tag("estado_cielo");
  const viento = tag("viento");
  const oleaje = tag("oleaje");
  const num = (n: string) => {
    const v = Number(attr(tag(n), "valor1"));
    return Number.isFinite(v) && attr(tag(n), "valor1") !== "" ? v : undefined;
  };
  return {
    fecha: `${fecha.slice(0, 4)}-${fecha.slice(4, 6)}-${fecha.slice(6, 8)}`,
    manana: {
      cielo: attr(cielo, "descripcion1"),
      viento: attr(viento, "descripcion1"),
      oleaje: attr(oleaje, "descripcion1"),
    },
    tarde: {
      cielo: attr(cielo, "descripcion2"),
      viento: attr(viento, "descripcion2"),
      oleaje: attr(oleaje, "descripcion2"),
    },
    tMax: num("t_maxima"),
    tAgua: num("t_agua"),
    uvMax: num("uv_max"),
    sensacion: attr(tag("s_termica"), "descripcion1") || undefined,
  };
}

async function fetchPlaya(info: PlayaInfo): Promise<Playa> {
  try {
    const res = await fetch(`https://www.aemet.es/xml/playas/play_v2_${info.id}.xml`, {
      headers: { "User-Agent": "TenerifeDiceBot/1.0 (https://tenerifedice.com)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return { ...info, dias: [] };
    const xml = new TextDecoder("latin1").decode(await res.arrayBuffer());
    const dias: DiaPlaya[] = [];
    const re = /<dia fecha="(\d{8})">([\s\S]*?)<\/dia>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml))) dias.push(parseDia(m[2], m[1]));
    const elaborado = xml.match(/<elaborado>([^<]*)<\/elaborado>/)?.[1];
    return { ...info, dias, elaborado };
  } catch {
    return { ...info, dias: [] };
  }
}

export async function getPlayas(): Promise<Playa[]> {
  return Promise.all(PLAYAS.map(fetchPlaya));
}

const RE_LLUVIA = /lluvia|tormenta|chubasco|llovizna/i;

/** Simple traffic light from AEMET's qualitative descriptions. */
export function veredicto(d: DiaPlaya): Veredicto {
  const franjas = [d.manana, d.tarde];
  const texto = franjas.map((f) => `${f.cielo} ${f.viento} ${f.oleaje}`).join(" ");
  if (/fuerte|muy fuerte|huracanado/i.test(texto) || RE_LLUVIA.test(texto)) return "malo";
  if (/moderad/i.test(texto) || franjas.every((f) => /cubierto|muy nuboso/i.test(f.cielo))) return "regular";
  return "bueno";
}

export function hoyCanarias(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Atlantic/Canary" }).format(new Date());
}

export type ResumenPlayas = {
  fecha: string;
  mejores: { nombre: string; municipio: string; zona: Zona; tMax?: number; tAgua?: number }[];
  precaucion: number;
  evitar: number;
  total: number;
};

function diaPara(p: Playa, fecha: string): DiaPlaya | undefined {
  return p.dias.find((d) => d.fecha === fecha) ?? p.dias.find((d) => d.fecha > fecha);
}

/** Day summary shared by the page, the JSON feed and the Instagram image. */
export function resumir(playas: Playa[]): ResumenPlayas | null {
  const conDatos = playas.filter((p) => p.dias.length > 0);
  if (conDatos.length === 0) return null;
  const hoy = hoyCanarias();
  const fecha = conDatos.map((p) => diaPara(p, hoy)?.fecha).filter((f): f is string => !!f).sort()[0] ?? hoy;
  const conDia = conDatos.map((p) => ({ p, d: diaPara(p, fecha) })).filter((x) => x.d) as { p: Playa; d: DiaPlaya }[];
  const v = conDia.map((x) => ({ ...x, v: veredicto(x.d) }));
  const mejores = v
    .filter((x) => x.v === "bueno")
    .sort((a, b) => (b.d.tMax ?? 0) - (a.d.tMax ?? 0))
    .slice(0, 6)
    .map(({ p, d }) => ({ nombre: p.nombre, municipio: p.municipio, zona: p.zona, tMax: d.tMax, tAgua: d.tAgua }));
  return {
    fecha,
    mejores,
    precaucion: v.filter((x) => x.v === "regular").length,
    evitar: v.filter((x) => x.v === "malo").length,
    total: v.length,
  };
}
