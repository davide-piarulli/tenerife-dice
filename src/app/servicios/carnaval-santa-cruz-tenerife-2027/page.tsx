import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { getServicio } from "@/lib/servicios";

const servicio = getServicio("carnaval-santa-cruz-tenerife-2027")!;
const path = `/servicios/${servicio.slug}/`;

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

type Cita = { fecha: string; iso: string; evento: string; destacado?: boolean };

const PROGRAMA: Cita[] = [
  { fecha: "Viernes 22 de enero", iso: "2027-01-22", evento: "Gala Inaugural" },
  { fecha: "29 y 30 de enero", iso: "2027-01-29", evento: "Concurso de murgas infantiles" },
  { fecha: "Del 1 al 4 de febrero", iso: "2027-02-01", evento: "Fases del concurso de murgas adultas" },
  { fecha: "Sábado 6 de febrero", iso: "2027-02-06", evento: "Final del concurso de murgas adultas", destacado: true },
  { fecha: "Miércoles 10 de febrero", iso: "2027-02-10", evento: "Gala de elección de la Reina de los Mayores" },
  { fecha: "Sábado 13 de febrero", iso: "2027-02-13", evento: "Concurso de comparsas" },
  { fecha: "Miércoles 17 de febrero", iso: "2027-02-17", evento: "Gala de Elección de la Reina del Carnaval", destacado: true },
  { fecha: "Viernes 19 de febrero", iso: "2027-02-19", evento: "Cabalgata Anunciadora: empieza el carnaval en la calle", destacado: true },
  { fecha: "Domingo 21 de febrero", iso: "2027-02-21", evento: "Carnaval de Día" },
  { fecha: "Lunes 22 de febrero", iso: "2027-02-22", evento: "Gala Drag Queen (Dragnaval)" },
  { fecha: "Martes 23 de febrero", iso: "2027-02-23", evento: "Coso Apoteosis (festivo local en Santa Cruz)", destacado: true },
  { fecha: "Viernes 26 de febrero", iso: "2027-02-26", evento: "Coso infantil y Viernes de Piñata" },
  { fecha: "Sábado 27 de febrero", iso: "2027-02-27", evento: "Carnaval de Día" },
  { fecha: "Domingo 28 de febrero", iso: "2027-02-28", evento: "Carnaval sénior, fuegos artificiales y cierre" },
];

const FAQ = [
  {
    q: "¿Cuándo es el Carnaval de Santa Cruz de Tenerife 2027?",
    a: "El carnaval en la calle va del viernes 19 al domingo 28 de febrero de 2027, con el Martes de Carnaval el 23 de febrero. Los concursos y galas empiezan antes: la Gala Inaugural es el 22 de enero, la final de murgas el 6 de febrero y la Gala de la Reina el 17 de febrero.",
  },
  {
    q: "¿Por qué el carnaval de 2027 es más tarde de lo habitual?",
    a: "El Ayuntamiento de Santa Cruz lo ha retrasado dos semanas respecto al calendario litúrgico porque el Recinto Ferial está ocupado hasta después de Reyes y no da tiempo a montar el escenario.",
  },
  {
    q: "¿Cuál es el tema del Carnaval 2027?",
    a: "«Roma Eterna: El Imperio del Carnaval», un guiño a la alegoría de 1987.",
  },
  {
    q: "¿Dónde se compran las entradas para las galas y la final de murgas?",
    a: "En 2026 las entradas se vendieron en la web oficial entradascarnavaltenerife.com y en la taquilla del Recinto Ferial; las de la final de murgas, comparsas y Gala de la Reina, solo por internet. La fecha de venta para 2027 aún no se ha anunciado.",
  },
];

export default function CarnavalPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Carnaval de Santa Cruz de Tenerife 2027",
      startDate: "2027-01-22",
      endDate: "2027-02-28",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Santa Cruz de Tenerife",
        address: { "@type": "PostalAddress", addressLocality: "Santa Cruz de Tenerife", addressCountry: "ES" },
      },
      organizer: { "@type": "Organization", name: "Ayuntamiento de Santa Cruz de Tenerife", url: "https://www.carnavaldetenerife.com/" },
      description: "Programa del Carnaval de Santa Cruz de Tenerife 2027, con el tema «Roma Eterna: El Imperio del Carnaval».",
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Guía práctica</p>
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-volcanic sm:text-4xl">
        {servicio.title}
      </h1>
      <p className="mt-3 text-lg text-ink/75">
        El Carnaval de 2027 se celebra con el tema <strong>«Roma Eterna: El Imperio del Carnaval»</strong> y llega
        más tarde de lo habitual: la fiesta en la calle será del <strong>19 al 28 de febrero</strong>.
      </p>
      <p className="mt-2 text-sm text-muted">Información revisada el 15 de noviembre de 2026.</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-volcanic">Programa y fechas</h2>
        <ol className="mt-4 space-y-2">
          {PROGRAMA.map((c) => (
            <li
              key={c.iso + c.evento}
              className={`flex flex-col gap-1 rounded-lg p-3 sm:flex-row sm:gap-4 ${c.destacado ? "border-l-4 border-sunset bg-white shadow-sm" : "bg-white/60"}`}
            >
              <time dateTime={c.iso} className="w-48 shrink-0 text-sm font-semibold text-ocean">
                {c.fecha}
              </time>
              <span className="text-ink">{c.evento}</span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-sm text-muted">
          Programa anunciado en junio de 2026. Las fechas del Entierro de la Sardina y de la Piñata Chica aún no
          están confirmadas.
        </p>
      </section>

      <div className="prose-article mt-10">
        <h2>¿Por qué este año es más tarde?</h2>
        <p>
          Por calendario litúrgico, el Martes de Carnaval de 2027 caería el 9 de febrero. El Ayuntamiento de Santa
          Cruz ha retrasado la fiesta dos semanas porque el Recinto Ferial está ocupado por el Parque Infantil hasta
          después de Reyes y no da tiempo a montar el escenario. Por eso el Martes de Carnaval, festivo local, será
          el <strong>23 de febrero</strong>. La Laguna también ha movido su festivo.
        </p>

        <h2>Dónde se celebra</h2>
        <ul>
          <li>
            <strong>Galas y concursos</strong> (murgas, comparsas, Reina): en el Recinto Ferial de Tenerife.
          </li>
          <li>
            <strong>Carnaval en la calle</strong>: en el centro de Santa Cruz, con la avenida de Anaga y la plaza de
            España como ejes principales.
          </li>
        </ul>

        <h2>Entradas</h2>
        <p>
          La venta de 2027 todavía no tiene fecha. En 2026 se vendieron en la web oficial{" "}
          <a href="https://entradascarnavaltenerife.com" target="_blank" rel="noopener noreferrer">
            entradascarnavaltenerife.com
          </a>{" "}
          y en la taquilla del Recinto Ferial. Las de la final de murgas, el concurso de comparsas y la Gala de la
          Reina solo se vendían por internet, con un máximo de cuatro por tarjeta. Las 7.000 entradas de la final
          de murgas se agotaron en una hora, así que conviene estar atento el día de la venta.
        </p>

        <h2>Consejos para el carnaval en la calle</h2>
        <ul>
          <li>Ve en guagua o tranvía: los cortes de tráfico en el centro son amplios esos días.</li>
          <li>
            ¿Vienes desde el aeropuerto? Mira{" "}
            <Link href="/servicios/guaguas-aeropuertos-tenerife/">qué guagua coger desde Tenerife Sur o Norte</Link>.
          </li>
          <li>Hidrátate, protégete del sol en el Carnaval de Día y cuida tus objetos personales.</li>
          <li>En caso de emergencia, llama al 112.</li>
        </ul>

        <h2>Preguntas frecuentes</h2>
        {FAQ.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}

        <p className="text-sm">
          Fuentes: Ayuntamiento de Santa Cruz de Tenerife (carnavaldetenerife.com), RTVC y Diario de Avisos. El
          programa puede cambiar; la referencia oficial es la web del Carnaval.
        </p>
      </div>
    </article>
  );
}
