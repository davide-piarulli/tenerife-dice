"use client";

import { useEffect, useState } from "react";

type Aviso = {
  zona: string;
  fenomeno: string;
  nivel: "amarillo" | "naranja" | "rojo";
  desde: string;
  hasta: string;
};

type Respuesta = {
  actualizado: string;
  hayAvisos: boolean;
  avisos: Aviso[];
  fuenteUrl: string;
  feedOk: boolean;
};

const ENDPOINT = "https://n8n.manistudio.es/webhook/tenerife-dice-avisos";
const AEMET_URL = "https://www.aemet.es/es/eltiempo/prediccion/avisos?k=coo";

const ESTILO_NIVEL: Record<Aviso["nivel"], string> = {
  amarillo: "border-yellow-400 bg-yellow-50",
  naranja: "border-orange-500 bg-orange-50",
  rojo: "border-red-600 bg-red-50",
};

const fechaHora = new Intl.DateTimeFormat("es-ES", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Atlantic/Canary",
});

function formatear(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : fechaHora.format(d);
}

export function AvisosLive() {
  const [datos, setDatos] = useState<Respuesta | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelado = false;
    fetch(ENDPOINT)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: Respuesta) => {
        if (cancelado) return;
        if (!json.feedOk) setError(true);
        else setDatos(json);
      })
      .catch(() => {
        if (!cancelado) setError(true);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-5">
        <p className="text-ink">
          No hemos podido cargar ahora los avisos. Consulta el estado oficial en{" "}
          <a href={AEMET_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-ocean underline">
            la web de AEMET
          </a>
          .
        </p>
      </div>
    );
  }

  if (!datos) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-5 text-muted" aria-live="polite">
        Cargando los avisos vigentes…
      </div>
    );
  }

  return (
    <div aria-live="polite">
      {datos.hayAvisos ? (
        <ul className="space-y-3">
          {datos.avisos.map((a) => (
            <li
              key={`${a.zona}-${a.fenomeno}-${a.desde}`}
              className={`rounded-xl border-l-4 p-4 ${ESTILO_NIVEL[a.nivel] ?? ESTILO_NIVEL.amarillo}`}
            >
              <p className="font-display text-lg font-bold text-volcanic">
                Aviso {a.nivel} por {a.fenomeno}
              </p>
              <p className="text-ink">{a.zona}</p>
              <p className="mt-1 text-sm text-muted">
                {a.desde ? `Desde ${formatear(a.desde)}` : null}
                {a.hasta ? ` hasta ${formatear(a.hasta)}` : null}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border-l-4 border-green-600 bg-green-50 p-4">
          <p className="font-display text-lg font-bold text-volcanic">
            Sin avisos meteorológicos en Tenerife
          </p>
          <p className="text-ink">
            AEMET no tiene ahora mismo avisos activos ni previstos para ninguna zona de la isla.
          </p>
        </div>
      )}
      <p className="mt-2 text-xs text-muted">
        Datos de AEMET vía Meteoalarm · comprobado {formatear(datos.actualizado)} (hora canaria) ·{" "}
        <a href={AEMET_URL} target="_blank" rel="noopener noreferrer" className="underline">
          ver en AEMET
        </a>
      </p>
    </div>
  );
}
