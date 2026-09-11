import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: `Aviso legal de ${SITE.name}.`,
  alternates: { canonical: "/aviso-legal/" },
};

export default function LegalNoticePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-volcanic">Aviso legal</h1>
      <div className="prose-article mt-6">
        <p>
          Este sitio web, {SITE.name} ({SITE.url}), es un medio digital de noticias.
          Este aviso legal es un modelo de partida y debe ser revisado y completado por
          un profesional antes de la publicación pública del sitio.
        </p>
        <h2>Titularidad</h2>
        <p>[Pendiente de completar: razón social, NIF/CIF, domicilio, datos registrales.]</p>
        <h2>Propiedad intelectual</h2>
        <p>
          Los contenidos originales de {SITE.name} están protegidos por derechos de
          propiedad intelectual. Cuando un artículo se elabora a partir de información
          publicada por terceros, se cita y enlaza la fuente original.
        </p>
        <h2>Solicitudes de corrección o retirada</h2>
        <p>
          Cualquier persona o medio que considere que un contenido publicado infringe
          sus derechos puede solicitar su revisión, corrección o retirada escribiendo a{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    </div>
  );
}
