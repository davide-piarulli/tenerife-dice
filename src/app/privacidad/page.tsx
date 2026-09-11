import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Política de privacidad de ${SITE.name}.`,
  alternates: { canonical: "/privacidad" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-volcanic">
        Política de privacidad
      </h1>
      <div className="prose-article mt-6">
        <p>
          Este documento es un modelo de partida conforme al RGPD y debe ser revisado
          por un profesional antes de la publicación pública del sitio.
        </p>
        <h2>Responsable del tratamiento</h2>
        <p>[Pendiente de completar.]</p>
        <h2>Datos que tratamos</h2>
        <p>
          Datos de contacto facilitados voluntariamente a través del correo electrónico
          ({SITE.email}) y datos de navegación agregados con fines estadísticos.
        </p>
        <h2>Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición y
          portabilidad escribiendo a <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    </div>
  );
}
