"use client";

import { useEffect, useState } from "react";
import { Clock, FileText, MapPin, Phone } from "lucide-react";
import { diaGuardia, mapsUrl, nombreFecha, sumarDias, telHref, type Turno } from "@/lib/guardia-util";

type Props = {
  nombre: string;
  cubre: string;
  turnos: Record<string, Turno>;
  fija: Turno | null;
  pdf: string | null;
  /** Día de guardia calculado al generar la página; el navegador lo recalcula con la hora real. */
  diaInicial: string;
};

function Datos({ t, zona }: { t: Turno; zona: string }) {
  return (
    <div className="mt-2 space-y-1.5 text-sm">
      {t.titular && <p className="font-semibold text-volcanic">{t.titular}</p>}
      <p className="flex items-start gap-1.5 text-ink/85">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sunset" aria-hidden />
        <a href={mapsUrl(t, zona)} target="_blank" rel="noopener noreferrer" className="hover:text-ocean hover:underline">
          {t.direccion}
        </a>
      </p>
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <a href={telHref(t.telefono)} className="inline-flex items-center gap-1.5 font-semibold text-ocean hover:underline">
          <Phone className="h-4 w-4" aria-hidden /> {t.telefono}
        </a>
        {t.horario && (
          <span className="inline-flex items-center gap-1.5 text-muted">
            <Clock className="h-4 w-4" aria-hidden /> {t.horario}
          </span>
        )}
      </p>
    </div>
  );
}

export function GuardiaZona({ nombre, cubre, turnos, fija, pdf, diaInicial }: Props) {
  const [dia, setDia] = useState(diaInicial);
  useEffect(() => {
    // La página es estática: recalcula qué guardia está en curso con la hora de Canarias del visitante.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDia(diaGuardia());
  }, []);

  const hoy = turnos[dia];
  const manana = turnos[sumarDias(dia, 1)];
  const id = nombre.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-");

  return (
    <section id={id} className="scroll-mt-24 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h3 className="font-display text-lg font-bold text-volcanic">{nombre}</h3>
      <p className="text-xs text-muted">{cubre}</p>

      {fija ? (
        <>
          <p className="mt-3 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            Guardia fija 24 horas
          </p>
          <Datos t={fija} zona={nombre} />
        </>
      ) : hoy ? (
        <>
          <p className="mt-3 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-emerald-800" suppressHydrationWarning>
            De guardia · {nombreFecha(dia)}
          </p>
          <Datos t={hoy} zona={nombre} />
          {manana && (
            <p className="mt-3 border-t border-black/5 pt-2 text-xs text-muted" suppressHydrationWarning>
              <span className="font-semibold capitalize">{nombreFecha(sumarDias(dia, 1))}</span> desde las 9:00:{" "}
              {manana.titular ? `${manana.titular}, ` : ""}
              {manana.direccion} ({manana.telefono})
            </p>
          )}
        </>
      ) : (
        <p className="mt-3 text-sm text-ink/80">
          Consulta la farmacia de guardia de hoy en el calendario oficial de esta zona.
        </p>
      )}

      {pdf && (
        <a
          href={pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean hover:underline"
        >
          <FileText className="h-4 w-4" aria-hidden /> Calendario del mes (PDF del Colegio de Farmacéuticos)
        </a>
      )}
    </section>
  );
}
