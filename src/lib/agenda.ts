// Weekend agenda built from the Cabildo de Tenerife open data portal (CC BY).
// Dataset "Agenda de eventos deportivos en Tenerife", updated weekly by the Cabildo.
import { hoyCanarias } from "@/lib/playas";

export const AGENDA_FUENTE = {
  nombre: "Cabildo de Tenerife · Datos abiertos",
  dataset: "https://datos.tenerife.es/ckan/dataset/agenda-de-eventos-deportivos-en-tenerife",
  licencia: "CC BY",
};

const URL_JSON =
  "https://datos.tenerife.es/ckan/dataset/6cde1436-8d6f-4cf6-b5a5-c32c8a738478/resource/de1231c0-957a-4ad0-8b7b-19d6b1bfced6/download/agenda-de-eventos-deportivos-en-tenerife.json";

export type Evento = {
  nombre: string;
  url?: string;
  descripcion: string;
  lugar: string;
  municipio: string;
  /** "YYYY-MM-DD HH:MM:SS", Canary local time. */
  inicio: string;
  fin: string;
};

type Crudo = {
  evento_nombre?: string;
  evento_url?: string;
  evento_descripcion?: string;
  evento_lugar?: string;
  municipio_nombre?: string;
  evento_fecha_inicio?: string;
  evento_fecha_fin?: string;
};

let cache: Promise<Evento[]> | null = null;

/** Events not finished yet, sorted by start. Empty list if the portal is unavailable. */
export function getEventos(): Promise<Evento[]> {
  cache ??= (async () => {
    try {
      const res = await fetch(URL_JSON, {
        headers: { "User-Agent": "TenerifeDiceBot/1.0 (https://tenerifedice.com)" },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) return [];
      const json = (await res.json()) as { eventos?: Crudo[] };
      const hoy = hoyCanarias();
      return (json.eventos ?? [])
        .filter((e) => e.evento_nombre && e.evento_fecha_inicio)
        .map((e) => ({
          nombre: e.evento_nombre!.trim(),
          url: e.evento_url?.startsWith("http") ? e.evento_url : undefined,
          descripcion: (e.evento_descripcion ?? "").trim(),
          lugar: (e.evento_lugar ?? "").trim(),
          municipio: (e.municipio_nombre ?? "").trim(),
          inicio: e.evento_fecha_inicio!,
          fin: e.evento_fecha_fin || e.evento_fecha_inicio!,
        }))
        .filter((e) => e.fin.slice(0, 10) >= hoy)
        .sort((a, b) => a.inicio.localeCompare(b.inicio))
        // The dataset repeats some events (same name and day, slightly different place): keep the most complete one.
        .filter((e, i, arr) => {
          const clave = (x: Evento) => x.nombre.toLowerCase() + x.inicio.slice(0, 10);
          const iguales = arr.filter((x) => clave(x) === clave(e));
          const mejor = iguales.reduce((a, b) => ((b.lugar + b.municipio).length > (a.lugar + a.municipio).length ? b : a));
          return mejor === e;
        });
    } catch {
      return [];
    }
  })();
  return cache;
}

function sumarDias(fecha: string, n: number): string {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Friday–Sunday of this weekend (from today if we are already in it). */
export function finDeSemana(hoy = hoyCanarias()): { desde: string; hasta: string } {
  const dia = new Date(`${hoy}T12:00:00Z`).getUTCDay(); // 0 = domingo
  if (dia === 0) return { desde: hoy, hasta: hoy };
  if (dia >= 5) return { desde: hoy, hasta: sumarDias(hoy, 7 - dia) };
  return { desde: sumarDias(hoy, 5 - dia), hasta: sumarDias(hoy, 7 - dia) };
}

/** Events overlapping [desde, hasta]. */
export function eventosEntre(eventos: Evento[], desde: string, hasta: string): Evento[] {
  return eventos.filter((e) => e.inicio.slice(0, 10) <= hasta && e.fin.slice(0, 10) >= desde);
}

const fmtDia = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
export function nombreDia(fecha: string): string {
  return fmtDia.format(new Date(`${fecha.slice(0, 10)}T12:00:00Z`));
}
export function hora(fechaHora: string): string {
  const h = fechaHora.slice(11, 16);
  return h && h !== "00:00" ? h : "";
}
