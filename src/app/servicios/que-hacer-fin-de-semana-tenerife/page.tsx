import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { ExcursionesBox } from "@/components/ExcursionesBox";
import { SITE } from "@/lib/constants";
import { getServicio } from "@/lib/servicios";
import { getAllArticles } from "@/lib/articles";
import { AGENDA_FUENTE, eventosEntre, finDeSemana, getEventos, hora, nombreDia, type Evento } from "@/lib/agenda";

const servicio = getServicio("que-hacer-fin-de-semana-tenerife")!;
const path = `/servicios/${servicio.slug}/`;

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

function TarjetaEvento({ e }: { e: Evento }) {
  const h = hora(e.inicio);
  const contenido = (
    <>
      <span className="font-semibold text-volcanic group-hover:text-ocean">{e.nombre}</span>
      <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        {h && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden /> {h}
          </span>
        )}
        {(e.lugar || e.municipio) && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden /> {[e.lugar, e.municipio].filter(Boolean).join(", ")}
          </span>
        )}
      </span>
      {e.descripcion && <span className="mt-2 line-clamp-3 block text-sm text-ink/75">{e.descripcion}</span>}
    </>
  );
  const clase = "group block h-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:ring-ocean";
  return e.url ? (
    <a href={e.url} target="_blank" rel="noopener noreferrer" className={clase}>
      {contenido}
    </a>
  ) : (
    <div className={clase}>{contenido}</div>
  );
}

export default async function FinDeSemanaPage() {
  const eventos = await getEventos();
  const { desde, hasta } = finDeSemana();
  const delFinde = eventosEntre(eventos, desde, hasta);
  const dias: string[] = [];
  for (let d = desde; d <= hasta; d = new Date(new Date(`${d}T12:00:00Z`).getTime() + 864e5).toISOString().slice(0, 10)) dias.push(d);
  const proximos = eventos.filter((e) => e.inicio.slice(0, 10) > hasta).slice(0, 8);
  const PLANES = /fin de semana|romería|romeria|fiestas (patronales|de|en honor)|concierto|festival|feria|carrera popular|exposición|obra de teatro|mercadillo/i;
  const limite = Date.now() - 21 * 864e5;
  const noticias = (await getAllArticles())
    .filter((a) => new Date(a.date).getTime() >= limite && PLANES.test([a.title, a.excerpt, ...(a.tags ?? [])].join(" ")))
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Eventos en Tenerife del ${nombreDia(desde)} al ${nombreDia(hasta)}`,
    itemListElement: delFinde.slice(0, 20).map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: e.nombre,
        startDate: e.inicio.replace(" ", "T"),
        endDate: e.fin.replace(" ", "T"),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: e.lugar || e.municipio, address: `${e.municipio}, Tenerife` },
        ...(e.url ? { url: e.url } : {}),
        ...(e.descripcion ? { description: e.descripcion.slice(0, 300) } : {}),
      },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Agenda</p>
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-volcanic sm:text-4xl">
        Qué hacer este fin de semana en Tenerife
      </h1>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-volcanic shadow-sm ring-1 ring-black/5">
        <CalendarDays className="h-4 w-4 text-sunset" aria-hidden />
        {desde === hasta ? nombreDia(desde) : `Del ${nombreDia(desde)} al ${nombreDia(hasta)}`}
      </p>

      {delFinde.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-white p-5 text-ink/80 shadow-sm">
          Todavía no hay eventos publicados en la agenda oficial para estos días. Mira abajo las últimas noticias sobre
          planes y fiestas, o los próximos eventos.
        </p>
      ) : (
        dias.map((d) => {
          const lista = eventosEntre(delFinde, d, d);
          if (lista.length === 0) return null;
          return (
            <section key={d} className="mt-8">
              <h2 className="font-display text-xl font-bold capitalize text-volcanic">{nombreDia(d)}</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {lista.map((e) => (
                  <li key={e.nombre + e.inicio}>
                    <TarjetaEvento e={e} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}

      {noticias.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-volcanic">Planes y fiestas en las noticias</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {noticias.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      {proximos.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-volcanic">Próximos eventos</h2>
          <ul className="mt-3 divide-y divide-black/5 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            {proximos.map((e) => (
              <li key={e.nombre + e.inicio} className="flex gap-4 p-4">
                <span className="w-28 shrink-0 text-sm font-semibold capitalize text-sunset">{nombreDia(e.inicio)}</span>
                <span className="min-w-0">
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-volcanic hover:text-ocean">
                      {e.nombre}
                    </a>
                  ) : (
                    <span className="font-semibold text-volcanic">{e.nombre}</span>
                  )}
                  <span className="block text-sm text-muted">{[e.lugar, e.municipio].filter(Boolean).join(", ")}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="prose-article mt-10">
        <h2>Antes de salir</h2>
        <ul>
          <li>
            Mira los <Link href="/servicios/avisos-aemet-tenerife/">avisos de AEMET</Link> y{" "}
            <Link href="/servicios/playas-tenerife-hoy/">cómo están las playas hoy</Link>.
          </li>
          <li>
            Revisa el <Link href="/servicios/estado-carreteras-tenerife/">estado de las carreteras</Link> si vas a cruzar la
            isla.
          </li>
        </ul>
        <p className="text-sm">
          Eventos: agenda oficial de eventos deportivos del{" "}
          <a href={AGENDA_FUENTE.dataset} target="_blank" rel="noopener noreferrer">
            {AGENDA_FUENTE.nombre}
          </a>{" "}
          (licencia {AGENDA_FUENTE.licencia}). Horarios y condiciones pueden cambiar: confírmalos con la organización.
        </p>
      </div>

      <ExcursionesBox ids={["ballenas", "teide-tour", "kayak", "estrellas"]} titulo="¿Buscas un plan diferente?" />
    </div>
  );
}
