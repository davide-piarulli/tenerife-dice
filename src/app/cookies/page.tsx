import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: `Política de cookies de ${SITE.name}.`,
  alternates: { canonical: "/cookies/" },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-volcanic">
        Política de cookies
      </h1>
      <div className="prose-article mt-6">
        <p>
          Este documento es un modelo de partida y debe ser revisado por un profesional
          antes de la publicación pública del sitio.
        </p>
        <h2>¿Qué son las cookies?</h2>
        <p>
          Pequeños archivos que se almacenan en tu navegador para recordar información
          sobre tu visita.
        </p>
        <h2>Cookies que utilizamos</h2>
        <p>
          {SITE.name} solo utiliza cookies de analítica de audiencia (Google Analytics),
          y únicamente si has dado tu consentimiento en el aviso que aparece en tu primera
          visita. No utilizamos cookies de publicidad ni de seguimiento entre sitios web.
        </p>
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Finalidad</th>
              <th>Duración</th>
              <th>Titular</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>td-cookie-consent</td>
              <td>Recuerda tu elección de aceptar o rechazar cookies de analítica.</td>
              <td>1 año (almacenamiento local del navegador)</td>
              <td>Propia</td>
            </tr>
            <tr>
              <td>_ga, _ga_*</td>
              <td>Analítica de audiencia (Google Analytics 4): páginas más visitadas, procedencia del tráfico.</td>
              <td>Hasta 2 años</td>
              <td>Google Ireland Limited</td>
            </tr>
          </tbody>
        </table>
        <h2>Gestión de cookies</h2>
        <p>
          Puedes cambiar tu elección en cualquier momento borrando los datos de este sitio
          en tu navegador, o configurar tu navegador para bloquear cookies de terceros.
          Consulta la ayuda de tu navegador para más información.
        </p>
      </div>
    </div>
  );
}
