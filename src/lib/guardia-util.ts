// Utilidades de farmacias de guardia usables también en el navegador (sin node:fs).

export type Turno = { titular: string; direccion: string; telefono: string; horario?: string };

function partesCanarias(d: Date) {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Atlantic/Canary",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const v = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return { fecha: `${v("year")}-${v("month")}-${v("day")}`, hora: Number(v("hour")) };
}

export function sumarDias(fecha: string, n: number): string {
  return new Date(new Date(`${fecha}T12:00:00Z`).getTime() + n * 864e5).toISOString().slice(0, 10);
}

/** Día de guardia en curso: las guardias van de 9:00 a 9:00, así que antes de las 9 sigue la del día anterior. */
export function diaGuardia(ahora = new Date()): string {
  const { fecha, hora } = partesCanarias(ahora);
  return hora < 9 ? sumarDias(fecha, -1) : fecha;
}

export function nombreFecha(fecha: string): string {
  return new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(`${fecha}T12:00:00Z`),
  );
}

export function mapsUrl(t: Turno, zona: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Farmacia ${t.direccion}, ${zona}, Tenerife`)}`;
}

export function telHref(tel: string) {
  return `tel:+34${tel.replace(/\D/g, "")}`;
}
