import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: `Quiénes somos y cómo trabajamos en ${SITE.name}, el medio digital de noticias de Tenerife.`,
  alternates: { canonical: "/sobre-nosotros" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-volcanic">Sobre nosotros</h1>

      <div className="prose-article mt-6">
        <p>
          <strong>Tenerife Dice</strong> es un medio digital de noticias centrado
          exclusivamente en la actualidad de la isla de Tenerife: sucesos, turismo,
          cultura, deporte, economía e instituciones. Nuestro objetivo es contar,
          cada día, lo que la isla dice y lo que le importa a quienes viven, trabajan
          o visitan Tenerife.
        </p>
        <h2>Cómo trabajamos</h2>
        <p>
          Seguimos la actualidad publicada por medios y fuentes oficiales de la isla y
          elaboramos, con redacción propia, artículos que resumen y contextualizan la
          información para nuestros lectores. Cuando un artículo se basa en información
          de un tercero, citamos y enlazamos siempre la fuente original al final del
          texto.
        </p>
        <p>
          Parte de nuestro proceso editorial utiliza herramientas de inteligencia
          artificial como apoyo a la redacción; todo el contenido pasa por una revisión
          editorial humana antes de su publicación.
        </p>
        <h2>Contacto</h2>
        <p>
          Si eres el titular de una fuente citada y quieres solicitar una corrección o
          la retirada de un contenido, escríbenos a{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    </div>
  );
}
