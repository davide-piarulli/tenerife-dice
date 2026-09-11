import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Ponte en contacto con la redacción de ${SITE.name}.`,
  alternates: { canonical: "/contacto/" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-volcanic">Contacto</h1>
      <p className="mt-4 text-ink/75">
        ¿Tienes una noticia, una corrección o quieres colaborar con {SITE.name}?
        Escríbenos.
      </p>

      <div className="mt-8 rounded-xl border border-black/10 bg-white p-6">
        <p className="text-sm text-muted">Redacción</p>
        <a
          href={`mailto:${SITE.email}`}
          className="text-lg font-semibold text-ocean hover:underline"
        >
          {SITE.email}
        </a>
      </div>
    </div>
  );
}
