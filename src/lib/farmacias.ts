// Farmacias de guardia de Tenerife.
// Los datos los genera scripts/guardias.py en cada despliegue (GitHub Actions, 09:30 y 15:30)
// a partir de los PDF mensuales del Colegio Oficial de Farmacéuticos de S/C de Tenerife.
// Si el fichero no existe o una zona no se pudo leer, la página enlaza al PDF oficial.
import { readFileSync } from "node:fs";
import path from "node:path";
import { diaGuardia, sumarDias, type Turno } from "@/lib/guardia-util";

export type { Turno };

export const COF = {
  nombre: "Colegio Oficial de Farmacéuticos de Santa Cruz de Tenerife",
  guardias: "https://www.coftenerife.es/ciudadanos/farmacias-de-guardia/",
  buscador: "https://www.coftenerife.es/farmacias/?neo",
};


type ZonaCruda = { nombre: string; pdf: Record<string, string>; turnos: Record<string, Turno>; fija: Turno | null };
type Datos = { generado: string; zonas: Record<string, ZonaCruda> };

export type Area = "Área metropolitana" | "Norte" | "Sur";

/** Zonas de guardia del COF en Tenerife, con nombre legible y municipios/barrios que cubren. */
export const ZONAS: { clave: string; nombre: string; cubre: string; area: Area; municipio: string }[] = [
  { clave: "santa-cruz-de-tenerife", nombre: "Santa Cruz de Tenerife", cubre: "Capital: centro, Ofra, Añaza, San Andrés…", area: "Área metropolitana", municipio: "Santa Cruz de Tenerife" },
  { clave: "san-cristobal-de-la-laguna", nombre: "La Laguna", cubre: "Casco de La Laguna, San Benito, La Concepción, Barrio Nuevo", area: "Área metropolitana", municipio: "San Cristóbal de La Laguna" },
  { clave: "la-cuesta", nombre: "La Cuesta", cubre: "La Cuesta y alrededores", area: "Área metropolitana", municipio: "San Cristóbal de La Laguna" },
  { clave: "taco", nombre: "Taco", cubre: "Taco, Los Majuelos, Tíncer", area: "Área metropolitana", municipio: "San Cristóbal de La Laguna" },
  { clave: "valle-guerra-bajamar-tejina-tegueste", nombre: "Valle Guerra, Bajamar, Tejina y Tegueste", cubre: "Nordeste de La Laguna y Tegueste", area: "Área metropolitana", municipio: "Tegueste" },
  { clave: "candelaria", nombre: "Candelaria", cubre: "Candelaria, Las Caletillas, Igueste", area: "Sur", municipio: "Candelaria" },
  { clave: "guimar-arafo", nombre: "Güímar y Arafo", cubre: "Güímar, El Puertito, Arafo", area: "Sur", municipio: "Güímar" },
  { clave: "arico-y-fasnia", nombre: "Arico y Fasnia", cubre: "Arico, Poris, Fasnia", area: "Sur", municipio: "Arico" },
  { clave: "san-miguel-y-granadilla", nombre: "San Miguel y Granadilla", cubre: "Golf del Sur, San Isidro, El Médano, Granadilla", area: "Sur", municipio: "Granadilla de Abona" },
  { clave: "adeje-y-arona", nombre: "Adeje y Arona", cubre: "Costa Adeje, Playa de las Américas, Los Cristianos, Arona", area: "Sur", municipio: "Adeje" },
  { clave: "guia-de-isora-santiago-del-teide", nombre: "Guía de Isora y Santiago del Teide", cubre: "Guía de Isora, Playa San Juan, Los Gigantes", area: "Sur", municipio: "Guía de Isora" },
  { clave: "la-matanza-la-victoria-santa-ursula-tacoronte-y-el-sauzal", nombre: "Tacoronte, El Sauzal, La Matanza, La Victoria y Santa Úrsula", cubre: "Comarca de Acentejo", area: "Norte", municipio: "Tacoronte" },
  { clave: "puerto-de-la-cruz", nombre: "Puerto de la Cruz", cubre: "Puerto de la Cruz, Punta Brava", area: "Norte", municipio: "Puerto de la Cruz" },
  { clave: "la-orotava-los-realejos", nombre: "La Orotava y Los Realejos", cubre: "La Orotava, Los Realejos", area: "Norte", municipio: "La Orotava" },
  { clave: "la-guancha-san-juan-de-la-rambla", nombre: "La Guancha y San Juan de la Rambla", cubre: "La Guancha, San Juan de la Rambla", area: "Norte", municipio: "La Guancha" },
  { clave: "icod-de-los-vinos", nombre: "Icod de los Vinos", cubre: "Icod de los Vinos", area: "Norte", municipio: "Icod de los Vinos" },
  { clave: "garachico", nombre: "Garachico", cubre: "Garachico", area: "Norte", municipio: "Garachico" },
  { clave: "buenavista-los-silos", nombre: "Buenavista del Norte y Los Silos", cubre: "Buenavista, Los Silos", area: "Norte", municipio: "Buenavista del Norte" },
];

export type ZonaGuardia = (typeof ZONAS)[number] & {
  /** Turnos de ayer a pasado mañana (clave YYYY-MM-DD = día en que empieza la guardia, a las 9:00). */
  turnos: Record<string, Turno>;
  fija: Turno | null;
  /** PDF oficial del mes en curso (o el último disponible). */
  pdf: string | null;
};

function leer(): Datos | null {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), "src/data/guardias.json"), "utf8")) as Datos;
  } catch {
    return null;
  }
}

export function getGuardias(): { zonas: ZonaGuardia[]; generado: string | null } {
  const datos = leer();
  const hoy = diaGuardia();
  const mes = hoy.slice(0, 7);
  const ventana = [-1, 0, 1, 2].map((n) => sumarDias(hoy, n));
  const zonas = ZONAS.map((z) => {
    const cruda = datos?.zonas[z.clave];
    const turnos: Record<string, Turno> = {};
    for (const d of ventana) if (cruda?.turnos[d]) turnos[d] = cruda.turnos[d];
    const pdfs = cruda ? Object.entries(cruda.pdf).sort(([a], [b]) => a.localeCompare(b)) : [];
    const pdf = cruda?.pdf[mes] ?? pdfs.at(-1)?.[1] ?? null;
    return { ...z, turnos, fija: cruda?.fija ?? null, pdf };
  });
  return { zonas, generado: datos?.generado ?? null };
}
