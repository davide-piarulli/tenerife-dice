import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { GuardiaZona } from "@/components/GuardiaZona";
import { SITE } from "@/lib/constants";
import { COF, getGuardias, type Area } from "@/lib/farmacias";
import { diaGuardia, nombreFecha } from "@/lib/guardia-util";
import { getArticulosRelacionados, getServicio } from "@/lib/servicios";

const servicio = getServicio("farmacias-de-guardia-tenerife")!;
const path = `/servicios/${servicio.slug}/`;

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

const AREAS: Area[] = ["Área metropolitana", "Sur", "Norte"];

const FAQ = [
  {
    q: "¿A qué hora cambia la farmacia de guardia en Tenerife?",
    a: "En la mayoría de zonas la guardia dura 24 horas: empieza a las 9:00 de la mañana del día indicado y termina a las 9:00 del día siguiente. Por eso, de madrugada sigue de guardia la farmacia del día anterior.",
  },
  {
    q: "¿Qué farmacia está de guardia 24 horas en Santa Cruz de Tenerife?",
    a: "Santa Cruz no tiene turnos rotativos: cuenta con una farmacia de guardia fija abierta las 24 horas, todos los días del año, además de varias farmacias con horario ampliado hasta las 21:00, las 22:00 o las 24:00.",
  },
  {
    q: "¿Cómo encuentro la farmacia abierta más cercana ahora mismo?",
    a: "El Colegio de Farmacéuticos tiene un buscador que usa tu ubicación y muestra las farmacias abiertas en este momento, incluidas las de horario ampliado.",
  },
  {
    q: "¿Puedo usar la receta electrónica en cualquier farmacia de guardia?",
    a: "Sí. Con la tarjeta sanitaria del Servicio Canario de la Salud puedes retirar tu medicación con receta electrónica en cualquier farmacia de Canarias, también en las de guardia.",
  },
  {
    q: "¿Y si es una urgencia médica?",
    a: "Si la situación es grave, llama al 112. Para urgencias que no pueden esperar, los centros de salud con servicio de urgencias (SUAP) y los hospitales atienden las 24 horas.",
  },
];

export default async function FarmaciasGuardiaPage() {
  const { zonas, generado } = getGuardias();
  const dia = diaGuardia();
  const conDatos = zonas.filter((z) => z.turnos[dia] || z.fija);
  const noticias = await getArticulosRelacionados(/farmacia|farmacéutic|medicamento|receta electrónica/i, 4);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Farmacias de guardia en Tenerife · ${nombreFecha(dia)}`,
      itemListElement: conDatos.map((z, i) => {
        const t = z.fija ?? z.turnos[dia];
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Pharmacy",
            name: t.titular ? `Farmacia ${t.titular}` : `Farmacia de guardia de ${z.nombre}`,
            address: { "@type": "PostalAddress", streetAddress: t.direccion, addressLocality: z.municipio, addressRegion: "Santa Cruz de Tenerife", addressCountry: "ES" },
            telephone: `+34 ${t.telefono}`,
          },
        };
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Servicio</p>
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-volcanic sm:text-4xl">
        Farmacias de guardia hoy en Tenerife
      </h1>
      <p className="mt-3 text-lg text-ink/75">
        La farmacia de guardia de cada zona de la isla, con dirección, teléfono y la de mañana. Las guardias cambian a
        las <strong>9:00 de la mañana</strong>: de madrugada sigue abierta la del día anterior.
      </p>
      <p className="mt-2 text-sm text-muted">
        Datos de los turnos oficiales del{" "}
        <a href={COF.guardias} target="_blank" rel="noopener noreferrer" className="underline hover:text-ocean">
          {COF.nombre}
        </a>
        {generado && <>, actualizados el {nombreFecha(generado.slice(0, 10))} a las {generado.slice(11, 16)}</>}. Ante la
        duda, llama antes de ir.
      </p>

      <nav aria-label="Zonas" className="mt-6 flex flex-wrap gap-2 text-sm">
        {AREAS.map((a) => (
          <a key={a} href={`#${a.toLowerCase().normalize("NFD").replace(/[^a-z]+/g, "-")}`} className="rounded-full bg-white px-3 py-1.5 font-semibold text-volcanic shadow-sm ring-1 ring-black/5 hover:text-ocean">
            {a}
          </a>
        ))}
        <a href={COF.buscador} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ocean px-3 py-1.5 font-semibold text-white shadow-sm hover:bg-ocean/90">
          Abiertas ahora cerca de mí ↗
        </a>
      </nav>

      {AREAS.map((a) => (
        <section key={a} id={a.toLowerCase().normalize("NFD").replace(/[^a-z]+/g, "-")} className="mt-10 scroll-mt-24">
          <h2 className="font-display text-2xl font-bold text-volcanic">{a}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {zonas
              .filter((z) => z.area === a)
              .map((z) => (
                <GuardiaZona key={z.clave} nombre={z.nombre} cubre={z.cubre} turnos={z.turnos} fija={z.fija} pdf={z.pdf} diaInicial={dia} />
              ))}
          </div>
        </section>
      ))}

      <div className="prose-article mt-12">
        <h2>Cómo funcionan las guardias en Tenerife</h2>
        <p>
          El Colegio Oficial de Farmacéuticos organiza la isla en zonas de guardia, y en cada una hay al menos una
          farmacia abierta fuera del horario habitual, según los turnos que fija la normativa canaria (Decretos 57/2009
          y 33/2013). En la mayoría de zonas la guardia es de 24 horas, de 9:00 a 9:00; en algunas, como Taco o
          Garachico, el turno termina antes de la medianoche y el calendario indica el horario exacto.
        </p>
        <p>
          Además de las guardias, muchas farmacias tienen <strong>horario ampliado</strong> y abren hasta las 21:00, las
          22:00 o las 24:00, sobre todo en Santa Cruz y La Laguna. El{" "}
          <a href={COF.buscador} target="_blank" rel="noopener noreferrer">
            buscador del Colegio
          </a>{" "}
          te muestra las que están abiertas en este momento cerca de ti.
        </p>

        <h2>Otros servicios útiles</h2>
        <ul>
          <li>
            Si vas a moverte de noche, consulta el{" "}
            <Link href="/servicios/estado-carreteras-tenerife/">estado de las carreteras</Link> y los{" "}
            <Link href="/servicios/avisos-aemet-tenerife/">avisos de AEMET</Link>.
          </li>
          <li>
            ¿Acabas de llegar? Mira <Link href="/servicios/guaguas-aeropuertos-tenerife/">qué guagua coger desde los aeropuertos</Link>.
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
          Fuente: turnos de guardia publicados mensualmente por el {COF.nombre}. Tenerife Dice no está vinculado al
          Colegio; si ves un dato que no coincide, la referencia es siempre el calendario oficial de la zona.
        </p>
      </div>

      {noticias.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-volcanic">Noticias sobre farmacias y salud</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {noticias.map((n) => (
              <ArticleCard key={n.slug} article={n} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
