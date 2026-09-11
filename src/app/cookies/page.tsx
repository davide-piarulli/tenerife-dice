import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: `Política de cookies de ${SITE.name}.`,
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-volcanic">
        Política de cookies
      </h1>
      <div className="prose-article mt-6">
        <p>
          Este documento es un modelo de partida y debe actualizarse en función de las
          cookies y herramientas de analítica/publicidad que se activen realmente en el
          sitio (p. ej. analítica de audiencia).
        </p>
        <h2>¿Qué son las cookies?</h2>
        <p>
          Pequeños archivos que se almacenan en tu navegador para recordar información
          sobre tu visita.
        </p>
        <h2>Gestión de cookies</h2>
        <p>
          Puedes configurar tu navegador para aceptar o rechazar cookies. Consulta la
          ayuda de tu navegador para más información.
        </p>
      </div>
    </div>
  );
}
