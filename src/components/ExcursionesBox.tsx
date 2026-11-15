import Link from "next/link";
import Image from "next/image";
import { AFILIADO, enlaceAfiliado, getExcursiones, imagenExcursion } from "@/lib/excursiones";

/** Affiliate box with partner excursions. Always shows the affiliate disclosure. */
export function ExcursionesBox({ ids, titulo }: { ids: string[]; titulo: string }) {
  const excursiones = getExcursiones(ids);
  if (excursiones.length === 0) return null;
  return (
    <aside className="mt-10 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-sunset">Excursiones recomendadas</p>
      <h2 className="mt-1 font-display text-xl font-bold text-volcanic">{titulo}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {excursiones.map((e) => (
          <li key={e.id}>
            <a
              href={enlaceAfiliado(e.url)}
              target="_blank"
              rel="sponsored noopener"
              className="block h-full overflow-hidden rounded-xl border border-black/5 transition hover:border-ocean hover:shadow-sm"
            >
              <span className="relative block aspect-[16/10]">
                <Image src={imagenExcursion(e)} alt={e.titulo} fill sizes="(min-width: 640px) 360px, 100vw" className="object-cover" />
              </span>
              <span className="block p-3">
                <span className="font-semibold text-ocean">{e.titulo}</span>
                <span className="mt-1 block text-sm text-ink/80">{e.descripcion}</span>
                {e.credito && <span className="mt-1 block text-[11px] text-muted">{e.credito}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">
        Enlaces de afiliado de nuestro partner {AFILIADO.nombre}: si reservas, Tenerife Dice recibe una comisión sin
        coste extra para ti. <Link href="/servicios/excursiones-tenerife/" className="underline">Ver todas las excursiones</Link>.
      </p>
    </aside>
  );
}
