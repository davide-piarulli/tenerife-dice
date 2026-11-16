import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { ExcursionesBox } from "@/components/ExcursionesBox";
import { SITE } from "@/lib/constants";
import { getArticulosRelacionados, getServicio } from "@/lib/servicios";

const servicio = getServicio("navidad-tenerife-2026")!;
const path = `/servicios/${servicio.slug}/`;

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

type Cita = { fecha: string; iso: string; evento: string; lugar: string; destacado?: boolean };

// Only dates confirmed by a 2026 source (revised 16/11/2026).
const CALENDARIO: Cita[] = [
  { fecha: "Jueves 19 de noviembre, 19.30", iso: "2026-11-19", evento: "Encendido de las luces de Navidad, con Los Sabandeños", lugar: "Plaza de La Candelaria, Santa Cruz", destacado: true },
  { fecha: "Viernes 20 de noviembre, por la tarde", iso: "2026-11-20", evento: "Encendido navideño de La Laguna", lugar: "Entorno de la plaza de La Concepción, La Laguna", destacado: true },
  { fecha: "Sábado 28 de noviembre", iso: "2026-11-28", evento: "La Noche en Blanco: mercado, teatro de calle, pasacalles y concierto de M-Clan", lugar: "Casco histórico de La Laguna" },
  { fecha: "Del 5 de diciembre al 5 de enero", iso: "2026-12-05", evento: "Belén de la Fundación CajaCanarias (entrada gratuita)", lugar: "Espacio Cultural CajaCanarias, plaza del Patriotismo, Santa Cruz" },
  { fecha: "Martes 8 de diciembre", iso: "2026-12-08", evento: "Festivo: Inmaculada Concepción", lugar: "Toda Canarias" },
  { fecha: "Jueves 24 de diciembre", iso: "2026-12-24", evento: "Primera Cabalgata de Papá Noel", lugar: "Santa Cruz de Tenerife" },
  { fecha: "Viernes 25 de diciembre", iso: "2026-12-25", evento: "Festivo: Navidad", lugar: "Toda Canarias" },
  { fecha: "Del 26 de diciembre al 3 de enero", iso: "2026-12-26", evento: "Musical «El fantasma de la ópera»", lugar: "Auditorio de Tenerife Adán Martín" },
  { fecha: "Viernes 1 de enero", iso: "2027-01-01", evento: "Festivo: Año Nuevo", lugar: "Toda Canarias" },
  { fecha: "Martes 5 de enero", iso: "2027-01-05", evento: "Cabalgata de Reyes", lugar: "Santa Cruz de Tenerife", destacado: true },
  { fecha: "Miércoles 6 de enero", iso: "2027-01-06", evento: "Festivo: Día de Reyes", lugar: "Toda Canarias" },
];

const ENCENDIDOS: { municipio: string; fecha: string; confirmado: boolean }[] = [
  { municipio: "Santa Cruz de Tenerife", fecha: "Jueves 19 de noviembre, 19.30 h", confirmado: true },
  { municipio: "La Laguna", fecha: "Viernes 20 de noviembre, por la tarde", confirmado: true },
  { municipio: "Candelaria", fecha: "En torno al 21 de noviembre", confirmado: false },
  { municipio: "La Orotava", fecha: "Alrededor del 28 de noviembre", confirmado: false },
  { municipio: "Puerto de la Cruz", fecha: "Alrededor del 28 de noviembre", confirmado: false },
  { municipio: "Arona", fecha: "Último fin de semana de noviembre", confirmado: false },
  { municipio: "Guía de Isora", fecha: "Último fin de semana de noviembre", confirmado: false },
  { municipio: "Icod de los Vinos", fecha: "Hacia el 3 de diciembre", confirmado: false },
  { municipio: "El Sauzal", fecha: "Hacia el 4 de diciembre", confirmado: false },
  { municipio: "Tegueste", fecha: "Hacia el 5 de diciembre", confirmado: false },
];

const FAQ = [
  {
    q: "¿Cuándo se encienden las luces de Navidad en Santa Cruz de Tenerife en 2026?",
    a: "El jueves 19 de noviembre a las 19.30 horas en la plaza de La Candelaria, con un concierto de villancicos de Los Sabandeños. Las luces llegan este año a más de 600 puntos de los cinco distritos.",
  },
  {
    q: "¿Cuándo es la Cabalgata de Reyes 2027 en Santa Cruz?",
    a: "El martes 5 de enero de 2027. El horario y el recorrido los publica el Ayuntamiento unos días antes.",
  },
  {
    q: "¿Qué días son festivos en Navidad en Tenerife?",
    a: "El 8 de diciembre (martes), el 25 de diciembre (viernes), el 1 de enero (viernes) y el 6 de enero (miércoles) son festivos en toda Canarias. Además, el 2 de febrero de 2027, día de la Candelaria, es festivo insular en Tenerife.",
  },
  {
    q: "¿Dónde ver un belén en Santa Cruz?",
    a: "El de la Fundación CajaCanarias abre del 5 de diciembre al 5 de enero en la plaza del Patriotismo, con entrada gratuita. Cierra el 25 de diciembre y el 1 de enero, y el 24, el 31 y el 5 de enero solo abre por la mañana.",
  },
];

export default async function NavidadPage() {
  const noticias = await getArticulosRelacionados(/navidad|navideñ|belén|belenes|cabalgata|nochevieja|reyes magos|papá noel/i, 6);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Navidad 2026 en Tenerife: fechas clave",
      itemListElement: CALENDARIO.filter((c) => !c.evento.startsWith("Festivo")).map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Event",
          name: c.evento,
          startDate: c.iso,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Place", name: c.lugar, address: `${c.lugar}, Tenerife` },
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Guía práctica</p>
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-volcanic sm:text-4xl">
        Navidad 2026 en Tenerife
      </h1>
      <p className="mt-3 text-lg text-ink/75">
        La temporada arranca el <strong>19 de noviembre</strong> con el encendido de Santa Cruz y termina con la{" "}
        <strong>Cabalgata de Reyes del 5 de enero</strong>. Aquí tienes las fechas confirmadas, los encendidos de
        cada municipio y los planes para estas fiestas.
      </p>
      <p className="mt-2 text-sm text-muted">
        Información revisada el 16 de noviembre de 2026. La iremos ampliando a medida que los ayuntamientos presenten
        sus programas.
      </p>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-volcanic">Fechas clave</h2>
        <ol className="mt-4 space-y-2">
          {CALENDARIO.map((c) => (
            <li
              key={c.iso + c.evento}
              className={`flex flex-col gap-1 rounded-lg p-3 sm:flex-row sm:gap-4 ${c.destacado ? "border-l-4 border-sunset bg-white shadow-sm" : "bg-white/60"}`}
            >
              <time dateTime={c.iso} className="w-56 shrink-0 text-sm font-semibold text-ocean">
                {c.fecha}
              </time>
              <span>
                <span className="text-ink">{c.evento}</span>
                <span className="block text-sm text-muted">{c.lugar}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-volcanic">Encendido de luces por municipio</h2>
        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand/60 text-volcanic">
              <tr>
                <th className="p-3 font-semibold">Municipio</th>
                <th className="p-3 font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {ENCENDIDOS.map((e) => (
                <tr key={e.municipio}>
                  <td className="p-3 font-medium text-volcanic">{e.municipio}</td>
                  <td className="p-3 text-ink/80">
                    {e.fecha}
                    {!e.confirmado && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">fecha habitual</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-muted">
          «Fecha habitual» es el día en que ese municipio suele encender sus luces; confírmalo en la web o las redes de
          tu ayuntamiento.
        </p>
      </section>

      <div className="prose-article mt-10">
        <h2>Santa Cruz: luces, Papá Noel y Reyes</h2>
        <p>
          La capital estrena este año más de 600 puntos de luz repartidos por los cinco distritos, unos 200 más que en
          2025. El gran árbol vuelve al lago de la plaza de España, y la recién reformada calle de La Rosa tendrá una
          decoración de temática espacial, con planetas y estrellas. Como novedad, el <strong>24 de diciembre</strong>{" "}
          se celebra por primera vez una Cabalgata de Papá Noel, y el <strong>5 de enero</strong> llega la Cabalgata de
          Reyes.
        </p>
        <p>
          Para los más pequeños, el distrito de Anaga ofrece hasta el 4 de diciembre talleres gratuitos de manualidades
          navideñas, sin inscripción: Casas de la Cumbre (lunes, 16.30-18.30), Igueste de Anaga (martes, 17.00-19.00),
          Almáciga (jueves, 17.00-19.00) y María Jiménez (viernes, 17.00-19.00).
        </p>

        <h2>La Laguna: encendido y Noche en Blanco</h2>
        <p>
          La Laguna enciende el viernes 20 de noviembre, esta vez en el entorno de la plaza de La Concepción. Una
          semana después, el sábado 28, llega La Noche en Blanco, con mercado, teatro de calle, cuatro pasacalles y un
          concierto de M-Clan en la plaza del Cristo para cerrar la jornada.
        </p>

        <h2>Belenes</h2>
        <p>
          El belén de la Fundación CajaCanarias abre del 5 de diciembre al 5 de enero en el Espacio Cultural
          CajaCanarias (plaza del Patriotismo, Santa Cruz), con entrada gratuita. Hasta el 22 de diciembre abre de
          lunes a viernes de 17.00 a 20.00, y los fines de semana y los días 6 y 8 de diciembre también de 10.00 a
          14.00. Del 23 de diciembre al 5 de enero abre a diario en horario de mañana y tarde; cierra el 25 de
          diciembre y el 1 de enero, y el 24, el 31 y el 5 solo abre por la mañana.
        </p>

        <h2>Espectáculos</h2>
        <p>
          Del 26 de diciembre al 3 de enero, el Auditorio de Tenerife acoge el musical <em>El fantasma de la ópera</em>.
          Para más planes de cada semana, mira{" "}
          <Link href="/servicios/que-hacer-fin-de-semana-tenerife/">qué hacer este fin de semana en Tenerife</Link>.
        </p>

        <h2>Consejos</h2>
        <ul>
          <li>
            Los días de encendido y de cabalgata hay cortes de tráfico en el centro: mejor en guagua o tranvía. Revisa el{" "}
            <Link href="/servicios/estado-carreteras-tenerife/">estado de las carreteras</Link>.
          </li>
          <li>
            Si viene familia de fuera, aquí está{" "}
            <Link href="/servicios/guaguas-aeropuertos-tenerife/">qué guagua coger desde los aeropuertos</Link>.
          </li>
          <li>
            Antes de un plan al aire libre, consulta los{" "}
            <Link href="/servicios/avisos-aemet-tenerife/">avisos de AEMET</Link>.
          </li>
        </ul>

        <h2>Preguntas frecuentes</h2>
        {FAQ.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}

        <p className="text-sm">
          Fuentes: Ayuntamiento de Santa Cruz y Ayuntamiento de La Laguna (a través de Diario de Avisos, elDiario.es y
          RTVC), Fundación CajaCanarias y calendario laboral del Gobierno de Canarias. Los horarios pueden cambiar: la
          referencia es siempre el organizador.
        </p>
      </div>

      {noticias.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-volcanic">Últimas noticias de Navidad</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {noticias.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      <ExcursionesBox ids={["teide-teleferico", "estrellas", "ballenas", "loro"]} titulo="¿Visitas Tenerife en Navidad?" />
    </article>
  );
}
