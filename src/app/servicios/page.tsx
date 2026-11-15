import type { Metadata } from "next";
import Link from "next/link";
import { SERVICIOS } from "@/lib/servicios";

export const metadata: Metadata = {
  title: "Servicios útiles en Tenerife",
  description:
    "Información práctica para vivir y moverse por Tenerife: avisos meteorológicos de AEMET y estado de las carreteras.",
  alternates: { canonical: "/servicios/" },
};

export default function ServiciosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-volcanic">Servicios útiles en Tenerife</h1>
      <p className="mt-3 text-lg text-ink/75">
        Información práctica que consultar antes de salir de casa.
      </p>
      <ul className="mt-8 space-y-4">
        {SERVICIOS.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/servicios/${s.slug}/`}
              className="block rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <span className="font-display text-xl font-bold text-ocean">{s.short}</span>
              <span className="mt-1 block text-ink">{s.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
