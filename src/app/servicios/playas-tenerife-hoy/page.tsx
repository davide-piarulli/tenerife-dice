import type { Metadata } from "next";
import Link from "next/link";
import { ExcursionesBox } from "@/components/ExcursionesBox";
import { SITE } from "@/lib/constants";
import { getServicio } from "@/lib/servicios";
import { getPlayas, hoyCanarias, veredicto, type DiaPlaya, type Playa, type Veredicto, type Zona } from "@/lib/playas";

const servicio = getServicio("playas-tenerife-hoy")!;
const path = `/servicios/${servicio.slug}/`;

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

const ZONAS: { zona: Zona; titulo: string; texto: string }[] = [
  { zona: "sur", titulo: "Playas del sur", texto: "Adeje, Arona, Granadilla y Arico. Suele ser la zona más soleada." },
  { zona: "oeste", titulo: "Playas del oeste", texto: "Guía de Isora y Santiago del Teide, al abrigo del alisio." },
  { zona: "este", titulo: "Playas del este y Santa Cruz", texto: "Santa Cruz, El Rosario, Candelaria y Güímar." },
  { zona: "norte", titulo: "Playas del norte", texto: "Más verde y fresco; el mar del norte suele estar más movido." },
];

const ESTILO: Record<Veredicto, { etiqueta: string; clase: string }> = {
  bueno: { etiqueta: "Buen día de playa", clase: "bg-green-100 text-green-900 border-green-600" },
  regular: { etiqueta: "Con precaución", clase: "bg-yellow-50 text-yellow-900 border-yellow-500" },
  malo: { etiqueta: "Mejor otro día", clase: "bg-red-50 text-red-900 border-red-600" },
};

const fmtDia = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
function diaLargo(fecha: string) {
  return fmtDia.format(new Date(`${fecha}T12:00:00Z`));
}

function franjaTexto(cielo: string, viento: string, oleaje: string) {
  return [cielo, viento && `viento ${viento}`, oleaje && `oleaje ${oleaje}`].filter(Boolean).join(", ");
}

function diaDe(p: Playa, fecha: string): DiaPlaya | undefined {
  return p.dias.find((d) => d.fecha === fecha) ?? p.dias.find((d) => d.fecha > fecha);
}

function TarjetaPlaya({ playa, dia }: { playa: Playa; dia?: DiaPlaya }) {
  const v = dia ? veredicto(dia) : null;
  return (
    <li id={`playa-${playa.id}`} className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold text-volcanic">{playa.nombre}</h3>
          <p className="text-sm text-muted">{playa.municipio}</p>
        </div>
        {v && (
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${ESTILO[v].clase}`}>
            {ESTILO[v].etiqueta}
          </span>
        )}
      </div>
      {dia ? (
        <dl className="mt-3 grid grid-cols-1 gap-1 text-sm text-ink sm:grid-cols-2">
          <div>
            <dt className="inline font-semibold">Mañana: </dt>
            <dd className="inline">{franjaTexto(dia.manana.cielo, dia.manana.viento, dia.manana.oleaje)}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">Tarde: </dt>
            <dd className="inline">{franjaTexto(dia.tarde.cielo, dia.tarde.viento, dia.tarde.oleaje)}</dd>
          </div>
          <div>
            {dia.tMax !== undefined && <span>Máx. {dia.tMax} °C</span>}
            {dia.tAgua !== undefined && <span> · agua {dia.tAgua} °C</span>}
          </div>
          <div>{dia.uvMax !== undefined && <span>Índice UV máx. {dia.uvMax}</span>}</div>
        </dl>
      ) : (
        <p className="mt-3 text-sm text-muted">Sin previsión disponible ahora mismo.</p>
      )}
      {playa.webcam && (
        <p className="mt-3 text-sm">
          <a
            href={playa.webcam.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-semibold text-ocean underline"
          >
            Webcam: {playa.webcam.titulo}
          </a>{" "}
          <span className="text-muted">({playa.webcam.proveedor})</span>
        </p>
      )}
    </li>
  );
}

export default async function PlayasPage() {
  const playas = await getPlayas();
  const conDatos = playas.filter((p) => p.dias.length > 0);
  const hoy = hoyCanarias();
  const fechaRef = conDatos.map((p) => diaDe(p, hoy)?.fecha).filter(Boolean).sort()[0] ?? hoy;
  const manana = conDatos.flatMap((p) => p.dias.map((d) => d.fecha)).filter((f) => f > fechaRef).sort()[0];

  const mejores = conDatos
    .map((p) => ({ p, d: diaDe(p, fechaRef) }))
    .filter((x) => x.d && veredicto(x.d) === "bueno")
    .sort((a, b) => (b.d?.tMax ?? 0) - (a.d?.tMax ?? 0))
    .slice(0, 6);

  const webcams = playas.filter((p) => p.webcam?.skylineId);

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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Servicio</p>
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-volcanic sm:text-4xl">
        {servicio.title}
      </h1>
      <p className="mt-3 text-lg text-ink/75">
        ¿A qué playa ir hoy? Estado del cielo, viento, oleaje, temperatura del agua e índice UV en las playas
        de Tenerife, según la previsión oficial de AEMET, con enlaces a las webcams en directo.
      </p>

      {conDatos.length === 0 ? (
        <p className="mt-8 rounded-xl bg-white p-5 text-ink shadow-sm">
          La previsión de playas no está disponible en este momento. Consúltala en{" "}
          <a href="https://www.aemet.es/es/eltiempo/prediccion/playas" className="text-ocean underline">
            AEMET
          </a>
          .
        </p>
      ) : (
        <>
          <section className="mt-8 rounded-2xl border-l-4 border-green-600 bg-white p-5 shadow-sm">
            <h2 className="font-display text-xl font-bold text-volcanic">
              Mejores playas para el {diaLargo(fechaRef)}
            </h2>
            {mejores.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {mejores.map(({ p, d }) => (
                  <li key={p.id}>
                    <a
                      href={`#playa-${p.id}`}
                      className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-900 hover:bg-green-200"
                    >
                      {p.nombre} · {d?.tMax} °C
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-ink">
                Hoy ninguna playa tiene condiciones ideales: hay viento u oleaje en buena parte de la isla.
                Revisa abajo cada zona y extrema la precaución.
              </p>
            )}
          </section>

          {ZONAS.map(({ zona, titulo, texto }) => {
            const lista = playas.filter((p) => p.zona === zona);
            if (lista.length === 0) return null;
            return (
              <section key={zona} className="mt-10">
                <h2 className="font-display text-2xl font-bold text-volcanic">{titulo}</h2>
                <p className="mt-1 text-sm text-muted">{texto}</p>
                <ul className="mt-4 grid gap-4 md:grid-cols-2">
                  {lista.map((p) => (
                    <TarjetaPlaya key={p.id} playa={p} dia={diaDe(p, fechaRef)} />
                  ))}
                </ul>
              </section>
            );
          })}

          {manana && (
            <p className="mt-6 text-sm text-muted">
              Previsión para el {diaLargo(fechaRef)}. AEMET actualiza la predicción de playas a diario; esta
              página se actualiza varias veces al día.
            </p>
          )}
        </>
      )}

      {webcams.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-volcanic">Webcams de playas de Tenerife</h2>
          <p className="mt-1 text-sm text-muted">
            Imagen reciente de cada cámara. Pulsa sobre ella para ver la emisión en directo en la web de su titular.
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {webcams.map((p) => (
              <figure key={p.id}>
                {/* Official SkylineWebcams embed snippet, kept unmodified (styled only through the wrapper). */}
                <div className="overflow-hidden rounded-xl bg-black [&_img]:aspect-video [&_img]:w-full [&_img]:object-cover">
                  <a href={p.webcam!.url} target="_blank">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://embed.skylinewebcams.com/img/${p.webcam!.skylineId}.jpg`}
                      alt={p.webcam!.titulo}
                      loading="lazy"
                    />
                  </a>
                </div>
                <figcaption className="mt-1 text-sm text-muted">
                  {p.webcam!.titulo} · {p.webcam!.proveedor}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <div className="prose-article mt-12">
        <h2>Cómo leer la previsión</h2>
        <ul>
          <li>
            <strong>Oleaje débil</strong>: mar tranquilo, ideal para el baño. <strong>Moderado</strong>: precaución,
            sobre todo con niños. <strong>Fuerte</strong>: mejor no bañarse y respetar siempre la bandera.
          </li>
          <li>
            Con el alisio, el <strong>norte</strong> suele tener más nubes y mar, mientras el <strong>sur</strong> y el
            <strong> oeste</strong> quedan más protegidos. Si el norte está revuelto, prueba al sur.
          </li>
          <li>
            Un <strong>índice UV</strong> de 6 o más es alto: protector solar, gorra y evitar las horas centrales.
          </li>
          <li>
            La bandera de la playa y las indicaciones del socorrista mandan siempre sobre cualquier previsión.
          </li>
        </ul>
        <p>
          ¿Hay aviso por fenómenos costeros? Consulta los{" "}
          <Link href="/servicios/avisos-aemet-tenerife/">avisos de AEMET en Tenerife</Link>.
        </p>
      </div>

      <p className="mt-8 text-xs text-muted">
        Fuente de la previsión: © AEMET, Agencia Estatal de Meteorología. Las webcams pertenecen a sus
        respectivos titulares.
      </p>
      <ExcursionesBox ids={["ballenas", "catamaran", "kayak", "fiat500"]} titulo="Planes en el mar" />
    </div>
  );
}
