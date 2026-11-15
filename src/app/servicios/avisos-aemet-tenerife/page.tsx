import type { Metadata } from "next";
import { AvisosLive } from "@/components/AvisosLive";
import { ArticleCard } from "@/components/ArticleCard";
import { SITE } from "@/lib/constants";
import { getArticulosRelacionados, getServicio } from "@/lib/servicios";

const servicio = getServicio("avisos-aemet-tenerife")!;
const path = `/servicios/${servicio.slug}/`;

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

const NIVELES = [
  { color: "bg-green-600", nombre: "Verde", texto: "Sin riesgo meteorológico." },
  {
    color: "bg-yellow-400",
    nombre: "Amarillo",
    texto:
      "No hay riesgo para la población en general, pero sí para algunas actividades concretas al aire libre (senderismo, pesca, deportes náuticos, trabajos en altura).",
  },
  {
    color: "bg-orange-500",
    nombre: "Naranja",
    texto:
      "Riesgo importante: fenómenos poco habituales y con cierto grado de peligro para las actividades usuales. Conviene informarse y extremar la precaución.",
  },
  {
    color: "bg-red-600",
    nombre: "Rojo",
    texto:
      "Riesgo extraordinario: fenómenos excepcionales de intensidad muy alta. Sigue en todo momento las indicaciones de las autoridades.",
  },
];

const ZONAS = [
  "Área metropolitana de Tenerife (Santa Cruz y La Laguna)",
  "Norte de Tenerife",
  "Este, sur y oeste de Tenerife",
  "Cumbres de Tenerife (incluido el Parque Nacional del Teide)",
];

export default async function AvisosAemetPage() {
  const relacionados = await getArticulosRelacionados(
    /aemet|lluvia|viento|calima|borrasca|temporal|tormenta|oleaje|meteorol|aviso amarillo|aviso naranja|prealerta/i,
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
        Consulta aquí, actualizados automáticamente, los avisos meteorológicos que la Agencia Estatal de
        Meteorología (AEMET) tiene activos o previstos para Tenerife.
      </p>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-bold text-volcanic">Avisos vigentes ahora</h2>
        <AvisosLive />
      </section>

      <div className="prose-article mt-10">
        <h2>Qué significa cada nivel de aviso</h2>
      </div>
      <ul className="mt-4 space-y-3">
        {NIVELES.map((n) => (
          <li key={n.nombre} className="flex gap-3 rounded-lg bg-white p-4 shadow-sm">
            <span className={`mt-1 h-4 w-4 shrink-0 rounded-full ${n.color}`} aria-hidden="true" />
            <p className="text-ink">
              <strong>{n.nombre}.</strong> {n.texto}
            </p>
          </li>
        ))}
      </ul>

      <div className="prose-article mt-10">
        <h2>Zonas de aviso en Tenerife</h2>
        <p>
          AEMET no emite los avisos para toda la isla a la vez, sino por zonas. Un aviso en las cumbres no
          implica que vaya a pasar lo mismo en la costa, y al revés. Las zonas de Tenerife son:
        </p>
        <ul>
          {ZONAS.map((z) => (
            <li key={z}>{z}</li>
          ))}
        </ul>

        <h2>Aviso de AEMET y alerta del Gobierno de Canarias no son lo mismo</h2>
        <p>
          AEMET emite <strong>avisos</strong> (amarillo, naranja o rojo) según la previsión. A partir de esos
          avisos, el Gobierno de Canarias puede declarar situaciones de <strong>prealerta</strong>,{" "}
          <strong>alerta</strong> o <strong>alerta máxima</strong> dentro de su plan de emergencias por
          fenómenos meteorológicos adversos. Esas declaraciones son las que activan medidas como la
          suspensión de clases o el cierre de espacios. Cuando haya una, la contaremos en nuestras noticias.
        </p>

        <h2>Consejos básicos ante un aviso</h2>
        <ul>
          <li>Con viento fuerte, evita zonas arboladas y asegura toldos, macetas y objetos en terrazas.</li>
          <li>Con fenómenos costeros, no te acerques a espigones, muelles ni zonas de rompiente.</li>
          <li>Con lluvias intensas, no cruces barrancos ni calles inundadas, ni a pie ni en coche.</li>
          <li>Con calima, limita el ejercicio al aire libre si tienes problemas respiratorios.</li>
          <li>En caso de emergencia, llama al <strong>112</strong>.</li>
        </ul>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-bold text-volcanic">Últimas noticias del tiempo en Canarias</h2>
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
