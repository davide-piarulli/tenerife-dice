import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { SITE } from "@/lib/constants";
import { getArticulosRelacionados, getServicio } from "@/lib/servicios";

const servicio = getServicio("estado-carreteras-tenerife")!;
const path = `/servicios/${servicio.slug}/`;

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

const FUENTES = [
  {
    nombre: "Carreteras del Cabildo de Tenerife",
    url: "https://www.tenerife.es/carreteras",
    texto:
      "El Cabildo gestiona la red de carreteras de la isla, incluidas la TF-1 y la TF-5. Su Centro de Información de Carreteras vigila las vías principales con cámaras y publica incidencias, cortes y obras.",
  },
  {
    nombre: "Cámaras de tráfico de Tenerife (RACE)",
    url: "https://www.race.es/mapa-de-carreteras-espana/camaras-trafico-tenerife",
    texto: "Mapa con imágenes de cámaras para ver cómo está la circulación antes de salir.",
  },
  {
    nombre: "Avisos meteorológicos en Tenerife",
    url: "/servicios/avisos-aemet-tenerife/",
    texto:
      "Viento, lluvia o nieve en cumbres son la causa más habitual de cortes en los accesos al Teide y de incidencias en la red.",
    interno: true,
  },
];

export default async function CarreterasPage() {
  const relacionados = await getArticulosRelacionados(
    /\bTF-\d|tráfico|carretera|atasco|retenciones|accidente de tráfico|tercer carril|guagua|tranv|accesos al teide/i,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: servicio.title,
    description: servicio.description,
    url: `${SITE.url}${path}`,
    inLanguage: "es",
    isPartOf: { "@id": `${SITE.url}/#website` },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Servicio</p>
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-volcanic sm:text-4xl">
        {servicio.title}
      </h1>
      <p className="mt-3 text-lg text-ink/75">
        Todo lo que necesitas para saber cómo están las carreteras de Tenerife antes de coger el coche: dónde
        ver el estado en tiempo real, qué obras afectan al tráfico y las últimas noticias.
      </p>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-bold text-volcanic">Dónde ver el tráfico en tiempo real</h2>
        <ul className="space-y-3">
          {FUENTES.map((f) => (
            <li key={f.nombre} className="rounded-xl bg-white p-4 shadow-sm">
              {f.interno ? (
                <Link href={f.url} className="font-display text-lg font-bold text-ocean underline">
                  {f.nombre}
                </Link>
              ) : (
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-lg font-bold text-ocean underline"
                >
                  {f.nombre}
                </a>
              )}
              <p className="mt-1 text-ink">{f.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="prose-article mt-10">
        <h2>Las vías que más tráfico soportan</h2>
        <p>
          <strong>TF-5 (autopista del Norte)</strong>: une Santa Cruz y La Laguna con el norte de la isla y el
          aeropuerto Tenerife Norte. Es la vía con más tráfico de Tenerife y la que más retenciones acumula en
          las horas de entrada y salida del trabajo y de la universidad.
        </p>
        <p>
          <strong>TF-1 (autopista del Sur)</strong>: conecta Santa Cruz con el aeropuerto Tenerife Sur y los
          municipios turísticos del sur, como Arona y Adeje. Los accidentes en esta vía suelen provocar largas
          colas en sentido sur o en sentido Santa Cruz.
        </p>
        <p>
          <strong>Accesos al Teide (TF-21, TF-24, TF-38)</strong>: el Cabildo los cierra cuando hay nieve,
          hielo, viento fuerte o riesgo de incendio en las cumbres. Antes de subir, comprueba los avisos
          meteorológicos y la web de carreteras del Cabildo.
        </p>

        <h2>Obras que afectan al tráfico</h2>
        <p>
          La obra más relevante en curso es el <strong>tercer carril de la TF-5 entre Guamasa y el aeropuerto
          Tenerife Norte</strong>. Te contamos los detalles en{" "}
          <Link href="/noticias/tercer-carril-tf-5-guamasa-aeropuerto/">nuestra noticia sobre el inicio de la
          obra</Link>.
        </p>

        <h2>Si te ves en un accidente o una emergencia</h2>
        <p>
          Llama al <strong>112</strong>. Si tu coche queda inmovilizado, colócate el chaleco reflectante, sal
          del vehículo por el lado contrario al tráfico y espera tras la bionda.
        </p>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-bold text-volcanic">Últimas noticias de tráfico y transporte</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {relacionados.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
