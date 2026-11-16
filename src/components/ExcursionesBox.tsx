import Link from "next/link";
import { AFILIADO, getExcursiones } from "@/lib/excursiones";
import { CuponDescuento } from "./CuponDescuento";
import { TarjetaExcursion } from "./ExcursionesExplorer";

/** Affiliate box with partner excursions. Always shows the affiliate disclosure. */
export function ExcursionesBox({ ids, titulo }: { ids: string[]; titulo: string }) {
  const excursiones = getExcursiones(ids);
  if (excursiones.length === 0) return null;
  return (
    <aside className="mt-12 rounded-3xl bg-sand-dark/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sunset">Excursiones recomendadas</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-volcanic">{titulo}</h2>
        </div>
        <Link href="/servicios/excursiones-tenerife/" className="text-sm font-semibold text-ocean underline">
          Ver todas
        </Link>
      </div>
      <div className="mt-3">
        <CuponDescuento />
      </div>
      <ul className="-mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
        {excursiones.map((e) => (
          <li key={e.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
            <TarjetaExcursion e={e} />
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">
        Enlaces de afiliado de nuestro partner {AFILIADO.nombre}: si reservas, Tenerife Dice recibe una comisión sin
        coste extra para ti.
      </p>
    </aside>
  );
}
