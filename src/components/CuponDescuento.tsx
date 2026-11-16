"use client";

import { useState } from "react";
import { Check, Copy, Tag } from "lucide-react";
import { AFILIADO } from "@/lib/excursiones";

/** Partner discount code with a copy button. `claro` = on a dark background. */
export function CuponDescuento({ claro = false }: { claro?: boolean }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(AFILIADO.cupon);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* clipboard not available: the code is visible anyway */
    }
  };
  return (
    <p
      className={`inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl px-4 py-2.5 text-sm ${
        claro ? "bg-white/95 text-volcanic shadow-lg" : "bg-white text-volcanic shadow-sm ring-1 ring-sunset/30"
      }`}
    >
      <Tag className="h-4 w-4 shrink-0 text-sunset" aria-hidden />
      <span>
        <strong>{AFILIADO.descuento} de descuento</strong> con el código
      </span>
      <button
        type="button"
        onClick={copiar}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-sunset bg-sunset/10 px-2.5 py-1 font-mono font-bold tracking-wider text-sunset-dark transition hover:bg-sunset/20"
        aria-label={`Copiar el código ${AFILIADO.cupon}`}
      >
        {AFILIADO.cupon}
        {copiado ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      </button>
      <span className="text-xs text-muted">{copiado ? "¡Copiado!" : "al reservar"}</span>
    </p>
  );
}
