"use client";

import { useEffect, useState } from "react";

type Aviso = { zona: string; fenomeno: string; nivel: "amarillo" | "naranja" | "rojo" };
type Respuesta = { hayAvisos: boolean; avisos: Aviso[]; feedOk: boolean };

const ENDPOINT = "https://n8n.manistudio.es/webhook/tenerife-dice-avisos";
const ORDEN = { rojo: 3, naranja: 2, amarillo: 1 } as const;
const PUNTO = { rojo: "bg-red-600", naranja: "bg-orange-500", amarillo: "bg-yellow-400" } as const;

/** One-line live status of AEMET warnings for the services hub. */
export function AvisosResumen() {
  const [datos, setDatos] = useState<Respuesta | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelado = false;
    fetch(ENDPOINT)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: Respuesta) => !cancelado && (j.feedOk ? setDatos(j) : setError(true)))
      .catch(() => !cancelado && setError(true));
    return () => {
      cancelado = true;
    };
  }, []);

  if (error) return <span className="text-ink/75">Consulta los avisos vigentes por zonas.</span>;
  if (!datos) return <span className="text-muted">Comprobando avisos…</span>;
  if (!datos.hayAvisos)
    return (
      <span className="flex items-center gap-2 font-semibold text-green-700">
        <span className="h-2.5 w-2.5 rounded-full bg-green-600" /> Sin avisos ahora mismo
      </span>
    );
  const peor = [...datos.avisos].sort((a, b) => ORDEN[b.nivel] - ORDEN[a.nivel])[0];
  return (
    <span className="flex items-start gap-2 font-semibold text-volcanic">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${PUNTO[peor.nivel] ?? PUNTO.amarillo}`} />
      <span>
        {datos.avisos.length === 1 ? "1 aviso activo" : `${datos.avisos.length} avisos activos`}: {peor.fenomeno} ({peor.nivel})
      </span>
    </span>
  );
}
