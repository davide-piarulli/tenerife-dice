import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Política de privacidad de ${SITE.name}.`,
  alternates: { canonical: "/privacidad/" },
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
        <p>
          Davide Piarulli, NIF Z0484000Q. Contacto: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
        <h2>Datos que tratamos</h2>
        <p>
          Datos de contacto facilitados voluntariamente a través del correo electrónico
          ({SITE.email}) y, únicamente si aceptas las cookies de analítica, datos de
          navegación agregados y anonimizados a través de Google Analytics (páginas
          vistas, procedencia del tráfico). Consulta nuestra{" "}
          <a href="/cookies">política de cookies</a> para más detalle.
        </p>
        <p>
          Además, para saber cuántas visitas recibe cada página usamos un contador propio sin cookies: solo registra
          la fecha, la página visitada y el dominio desde el que llegas (por ejemplo, google.com). No guarda tu
          dirección IP ni ningún identificador, no instala nada en tu dispositivo y no permite identificarte.
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
