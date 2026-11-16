import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { SITE } from "@/lib/constants";
import { hoyCanarias } from "@/lib/playas";
import { getArticulosRelacionados, getServicio } from "@/lib/servicios";

const servicio = getServicio("empleo-publico-ayudas-tenerife")!;
const path = `/servicios/${servicio.slug}/`;

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

type Enlace = { nombre: string; url: string; nota: string };
type Grupo = { titulo: string; enlaces: Enlace[] };

const DIRECTORIO: Grupo[] = [
  {
    titulo: "Cabildo de Tenerife",
    enlaces: [
      { nombre: "Oposiciones y listas de reserva", url: "https://sede.tenerife.es/es/tramites?idTema=EEET_EPL", nota: "Plazas del Cabildo. Las bolsas se llaman «listas de reserva» y la solicitud es solo online." },
      { nombre: "Ayudas y subvenciones", url: "https://sede.tenerife.es/es/tramites?idTipoServicio=ASBP_AS", nota: "Convocatorias abiertas o próximas para particulares, empresas y entidades." },
      { nombre: "Becas", url: "https://sede.tenerife.es/es/tramites?idTipoServicio=ASBP_BC", nota: "Becas de estudios, NEAE y otras del Cabildo." },
      { nombre: "Tablón de anuncios", url: "https://sede.tenerife.es/es/tablon-anuncios", nota: "Listas de admitidos, resoluciones y exposiciones públicas." },
      { nombre: "FIFEDE", url: "https://fifede.org/", nota: "Fundación del Cabildo para empleo y formación (Erasmus+ FP, cursos)." },
    ],
  },
  {
    titulo: "Gobierno de Canarias",
    enlaces: [
      { nombre: "Función Pública: convocatorias en curso", url: "https://www.gobiernodecanarias.org/administracionespublicas/funcionpublica/acceso/convocatorias-en-curso/", nota: "Oposiciones de la Administración autonómica, ofertas de empleo público y listas de empleo." },
      { nombre: "Servicio Canario de Empleo: ofertas", url: "https://www.gobiernodecanarias.org/empleo/sce/principal/areas_tematicas/empleo/demanda_y_ofertas_de_empleo/buscador_ofertas_empleo.html", nota: "Buscador de ofertas de trabajo, también del sector privado." },
      { nombre: "Sede electrónica: trámites y ayudas", url: "https://sede.gobiernodecanarias.org/sede/tramites", nota: "Filtra por «Subvenciones, Premios y Becas» para ver las ayudas autonómicas." },
      { nombre: "Boletín Oficial de Canarias (BOC)", url: "https://www.gobiernodecanarias.org/boc/", nota: "Donde se publican oficialmente las convocatorias autonómicas." },
    ],
  },
  {
    titulo: "Ayuntamientos y boletín provincial",
    enlaces: [
      { nombre: "Santa Cruz: empleo público", url: "https://sede.santacruzdetenerife.es/sede/publicaciones/empleo-publico", nota: "Plazas, listas de reserva y comisiones de servicio del Ayuntamiento." },
      { nombre: "Santa Cruz: Sociedad de Desarrollo", url: "https://sociedad-desarrollo.com/", nota: "Orientación laboral, formación y empleo municipal." },
      { nombre: "Ayuntamiento de La Laguna", url: "https://www.aytolalaguna.es/", nota: "Empleo público y Desarrollo Local (orientación y cursos)." },
      { nombre: "BOP de Santa Cruz de Tenerife", url: "https://www.bopsantacruzdetenerife.es/", nota: "Boletín de la provincia: aquí salen las bases de cabildos y ayuntamientos." },
    ],
  },
  {
    titulo: "Estado",
    enlaces: [
      { nombre: "Buscador de empleo público", url: "https://administracion.gob.es/empleopublico", nota: "Todas las convocatorias de las administraciones, filtrables por Canarias." },
      { nombre: "SEPE", url: "https://www.sepe.es/HomeSepe", nota: "Prestaciones por desempleo y búsqueda de trabajo." },
    ],
  },
];

type Convocatoria = { titulo: string; organismo: string; detalle: string; hasta?: string; plazo: string; url: string };

// Calls checked on 16/11/2026. Calls whose deadline has passed disappear on the next build.
const CONVOCATORIAS: Convocatoria[] = [
  {
    titulo: "Lista de reserva de Técnico/a de Grado Superior de Organización",
    organismo: "Cabildo de Tenerife",
    detalle: "Oposición para cubrir puestos temporales.",
    hasta: "2026-12-10",
    plazo: "Hasta el 10 de diciembre de 2026, 23.59",
    url: "https://sede.tenerife.es/es/tramites/3321979-Convocatoria-publica-para-la-configuracion-de-una-lista-de-reserva-de-Tecnico-a-de-Grado-Superior-de-Organizacion",
  },
  {
    titulo: "Becas para alumnado con necesidades educativas especiales (NEAE), curso 2026/2027",
    organismo: "Cabildo de Tenerife",
    detalle: "Revisa los requisitos de edad y curso en las bases antes de solicitarla.",
    hasta: "2026-11-30",
    plazo: "Hasta el 30 de noviembre de 2026, 23.59",
    url: "https://sede.tenerife.es/es/tramites/3266802-Becas-para-alumnado-con-necesidades-educativas-especiales,-curso-2026-2027",
  },
  {
    titulo: "Subvenciones a Escuelas de Música y Danza (curso 2025-2026)",
    organismo: "Cabildo de Tenerife",
    detalle: "Ayudas al funcionamiento de escuelas de música y danza.",
    hasta: "2026-11-16",
    plazo: "Hasta el 16 de noviembre de 2026, 23.59",
    url: "https://sede.tenerife.es/es/tramites?idTipoServicio=ASBP_AS",
  },
  {
    titulo: "Plazas de Arquitecto/a Técnico/a (7, acceso libre) y otras convocatorias",
    organismo: "Ayuntamiento de Santa Cruz",
    detalle: "Concurso-oposición. También hay una lista de reserva de Ingeniero/a Técnico/a Industrial. Comprueba el plazo en cada convocatoria.",
    plazo: "Ver plazo en la sede municipal",
    url: "https://sede.santacruzdetenerife.es/sede/publicaciones/empleo-publico",
  },
];

const PROXIMAS: { titulo: string; detalle: string }[] = [
  { titulo: "Ayudas a producciones escénicas profesionales (Cabildo, 210.000 €)", detalle: "Para compañías y autónomos con domicilio fiscal en Tenerife y estrenos entre el 1 de diciembre de 2026 y el 30 de noviembre de 2027. Hasta 6.000 € en proyectos de hasta 8.500 € y hasta 30.000 € en los mayores. El plazo empieza cuando se publique el extracto en el BOP." },
  { titulo: "Ayudas a salas privadas de artes escénicas y música (Cabildo, 100.000 €)", detalle: "Hasta el 80 % y un máximo de 20.000 € por sala, para espacios de menos de 500 butacas. Bases aprobadas el 11 de noviembre; plazo pendiente de publicación." },
  { titulo: "5 plazas de Técnico/a de Relaciones Laborales (Cabildo)", detalle: "Acceso libre. Figura en la sede del Cabildo como próxima convocatoria." },
];

export default async function EmpleoAyudasPage() {
  const hoy = hoyCanarias();
  const abiertas = CONVOCATORIAS.filter((c) => !c.hasta || c.hasta >= hoy);
  const noticias = await getArticulosRelacionados(
    /oposici[oó]n|oposiciones|empleo público|bolsa de empleo|lista de reserva|subvenci[oó]n|subvenciones|\bbecas?\b|convocatoria de ayudas|ayudas del cabildo/i,
    6,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Dónde se publican las oposiciones del Cabildo de Tenerife?",
        acceptedAnswer: { "@type": "Answer", text: "En la sede electrónica del Cabildo (sede.tenerife.es), apartado de empleo público, y oficialmente en el Boletín Oficial de la Provincia de Santa Cruz de Tenerife. La solicitud se presenta online." },
      },
      {
        "@type": "Question",
        name: "¿Qué es una lista de reserva del Cabildo?",
        acceptedAnswer: { "@type": "Answer", text: "Es la bolsa de empleo del Cabildo: una lista de personas que han superado un proceso selectivo y a las que se llama, por orden, para cubrir puestos temporales." },
      },
      {
        "@type": "Question",
        name: "¿Dónde busco ayudas del Gobierno de Canarias?",
        acceptedAnswer: { "@type": "Answer", text: "En la sede electrónica del Gobierno de Canarias (sede.gobiernodecanarias.org), filtrando por «Subvenciones, Premios y Becas». Las convocatorias se publican oficialmente en el BOC." },
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Guía práctica</p>
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-volcanic sm:text-4xl">
        Empleo público, ayudas y becas en Tenerife
      </h1>
      <p className="mt-3 text-lg text-ink/75">
        Las oposiciones, bolsas de empleo, ayudas y becas se publican en cuatro sitios distintos según quién las
        convoque. Aquí tienes todos los enlaces oficiales y las convocatorias abiertas que hemos revisado.
      </p>
      <p className="mt-2 text-sm text-muted">Convocatorias revisadas el 16 de noviembre de 2026.</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-volcanic">Convocatorias abiertas</h2>
        {abiertas.length === 0 ? (
          <p className="mt-3 text-ink/80">Ahora mismo no tenemos convocatorias abiertas revisadas. Consulta los enlaces de abajo.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {abiertas.map((c) => (
              <li key={c.titulo}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:ring-ocean"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-ocean">{c.organismo}</span>
                  <span className="mt-1 flex items-start justify-between gap-3 font-semibold text-volcanic group-hover:text-ocean">
                    {c.titulo}
                    <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted" aria-hidden />
                  </span>
                  <span className="mt-1 block text-sm text-ink/75">{c.detalle}</span>
                  <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${c.hasta ? "bg-sunset/10 text-sunset" : "bg-sand text-volcanic"}`}>
                    {c.plazo}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <h3 className="mt-8 font-display text-lg font-bold text-volcanic">Próximamente</h3>
        <ul className="mt-3 space-y-2">
          {PROXIMAS.map((p) => (
            <li key={p.titulo} className="rounded-lg bg-white/60 p-3">
              <span className="font-semibold text-volcanic">{p.titulo}</span>
              <span className="block text-sm text-ink/75">{p.detalle}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          Ya cerradas este año: becas de estudios del Cabildo 2026-2027 (plazo hasta el 30 de octubre) y Bono Alquiler
          Joven de Canarias 2026-2027 (hasta el 8 de octubre).
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-volcanic">Dónde mirar, según quién convoca</h2>
        {DIRECTORIO.map((g) => (
          <div key={g.titulo} className="mt-6">
            <h3 className="font-display text-lg font-bold text-volcanic">{g.titulo}</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {g.enlaces.map((e) => (
                <li key={e.url}>
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:ring-ocean"
                  >
                    <span className="flex items-start justify-between gap-2 font-semibold text-volcanic group-hover:text-ocean">
                      {e.nombre}
                      <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted" aria-hidden />
                    </span>
                    <span className="mt-1 text-sm text-ink/75">{e.nota}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <div className="prose-article mt-10">
        <h2>Consejos para no perder una convocatoria</h2>
        <ul>
          <li>
            Las bases salen primero en el <strong>BOP</strong> (cabildos y ayuntamientos) o en el <strong>BOC</strong>{" "}
            (Gobierno de Canarias). El plazo suele empezar a contar al día siguiente de publicarse el extracto.
          </li>
          <li>
            La mayoría de solicitudes son solo online: ten preparado tu certificado digital o Cl@ve antes de que abra
            el plazo.
          </li>
          <li>
            Las «listas de reserva» del Cabildo son su bolsa de empleo: se llama por orden para puestos temporales.
          </li>
          <li>
            Si te interesa una plaza concreta, guarda la página de la convocatoria: allí se publican después las
            listas de admitidos y las fechas de examen.
          </li>
        </ul>
        <p className="text-sm">
          Fuentes: sedes electrónicas del Cabildo de Tenerife, el Gobierno de Canarias y el Ayuntamiento de Santa Cruz,
          y noticias del Cabildo publicadas en noviembre de 2026. La información válida es siempre la de las bases
          oficiales.
        </p>
        <p className="text-sm">
          ¿Buscas otros trámites? Mira todos nuestros <Link href="/servicios/">servicios útiles en Tenerife</Link>.
        </p>
      </div>

      {noticias.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-volcanic">Últimas noticias sobre empleo y ayudas</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {noticias.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
