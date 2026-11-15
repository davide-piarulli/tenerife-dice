import type { Metadata } from "next";
import Link from "next/link";
import { ExcursionesBox } from "@/components/ExcursionesBox";
import { SITE } from "@/lib/constants";
import { getServicio } from "@/lib/servicios";

const servicio = getServicio("guaguas-aeropuertos-tenerife")!;
const path = `/servicios/${servicio.slug}/`;

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

type Linea = { linea: string; destino: string; detalle: string; url: string };

const TITSA = "https://titsa.com/index.php/tus-guaguas/lineas-y-horarios/";

const SUR: Linea[] = [
  {
    linea: "10",
    destino: "Santa Cruz de Tenerife (Intercambiador)",
    detalle: "Por Las Caletillas y San Isidro. Unos 55 minutos; todos los días, cada 30-45 minutos aproximadamente.",
    url: `${TITSA}linea-010`,
  },
  {
    linea: "40",
    destino: "Los Cristianos y Costa Adeje",
    detalle: "Unos 40 minutos; todos los días, en general cada 30 minutos.",
    url: `${TITSA}linea-040`,
  },
  {
    linea: "343",
    destino: "Aeropuerto Tenerife Norte y Puerto de la Cruz (y Costa Adeje en sentido contrario)",
    detalle: "Línea exprés con pocas salidas al día: consulta el horario antes.",
    url: `${TITSA}linea-343`,
  },
  {
    linea: "711",
    destino: "Santa Cruz, Los Cristianos y Costa Adeje",
    detalle: "Servicio nocturno.",
    url: `${TITSA}linea-711`,
  },
  {
    linea: "415",
    destino: "El Fraile / Las Galletas y San Isidro",
    detalle: "Conexión con el sureste de Arona y Granadilla.",
    url: `${TITSA}linea-415`,
  },
];

const NORTE: Linea[] = [
  {
    linea: "20",
    destino: "La Laguna y Santa Cruz de Tenerife (Intercambiador)",
    detalle: "Unos 20 minutos hasta Santa Cruz; todos los días, de primera hora de la mañana a pasada la medianoche.",
    url: `${TITSA}linea-020`,
  },
  {
    linea: "30",
    destino: "Puerto de la Cruz",
    detalle: "Conexión directa con el norte de la isla.",
    url: `${TITSA}linea-030`,
  },
  {
    linea: "343",
    destino: "Aeropuerto Tenerife Sur y Costa Adeje",
    detalle: "Exprés entre los dos aeropuertos; pocas salidas diarias.",
    url: `${TITSA}linea-343`,
  },
];

function Tabla({ titulo, lineas }: { titulo: string; lineas: Linea[] }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-2xl font-bold text-volcanic">{titulo}</h2>
      <ul className="mt-4 space-y-3">
        {lineas.map((l) => (
          <li key={l.linea + l.destino} className="flex gap-4 rounded-xl bg-white p-4 shadow-sm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ocean font-display text-lg font-bold text-white">
              {l.linea}
            </span>
            <div>
              <p className="font-semibold text-volcanic">{l.destino}</p>
              <p className="text-sm text-ink/80">{l.detalle}</p>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm text-ocean underline">
                Horario en TITSA
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function GuaguasAeropuertosPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Guía práctica</p>
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-volcanic sm:text-4xl">
        {servicio.title}
      </h1>
      <p className="mt-3 text-lg text-ink/75">
        Qué guagua coger al aterrizar en Tenerife Sur o Tenerife Norte, adónde va cada línea y cómo pagar.
      </p>
      <p className="mt-2 text-sm text-muted">Información revisada el 15 de noviembre de 2026.</p>

      <div className="mt-6 rounded-xl border-l-4 border-sunset bg-white p-4 text-ink shadow-sm">
        <strong>Ojo con guías antiguas:</strong> la línea 111 ya no entra en la terminal del aeropuerto Tenerife Sur
        (para en el cruce de la autopista) y la antigua 102 del aeropuerto Tenerife Norte fue sustituida por la 20.
      </div>

      <Tabla titulo="Desde el aeropuerto Tenerife Sur (Reina Sofía)" lineas={SUR} />
      <Tabla titulo="Desde el aeropuerto Tenerife Norte (Los Rodeos)" lineas={NORTE} />

      <div className="prose-article mt-10">
        <h2>Billetes y tarjeta Ten+</h2>
        <ul>
          <li>El precio depende de la distancia. Puedes comprar el billete sencillo al conductor.</li>
          <li>
            La tarjeta <strong>Ten+</strong> se vende en las máquinas de los aeropuertos, estaciones y quioscos, o en
            la app ten+ móvil. Se recarga con saldo («monedero») y hay bonos turísticos de 1 y 7 días.
          </li>
          <li>
            Los residentes en Canarias con el bono residente disfrutan del transporte gratuito para usuarios
            frecuentes, confirmado hasta el 31 de diciembre de 2026; la prórroga para 2027 está pendiente.
          </li>
          <li>
            Precios y condiciones actualizados en la{" "}
            <a href="https://titsa.com/index.php/tus-guaguas/billetes-y-tarifas/billetes-y-titulos-de-pago" target="_blank" rel="noopener noreferrer">
              web de TITSA
            </a>
            .
          </li>
        </ul>

        <h2>¿Y el tranvía?</h2>
        <p>
          El tranvía no llega a ningún aeropuerto. Desde Tenerife Norte puedes coger la línea 20 hasta el
          intercambiador de La Laguna y allí enlazar con el tranvía hacia Santa Cruz.
        </p>

        <h2>Antes de salir</h2>
        <ul>
          <li>
            Comprueba el <Link href="/servicios/estado-carreteras-tenerife/">estado de las carreteras</Link>: un
            accidente en la TF-1 o la TF-5 puede retrasar mucho las guaguas.
          </li>
          <li>
            Si vas a la playa al llegar, mira <Link href="/servicios/playas-tenerife-hoy/">cómo están las playas hoy</Link>.
          </li>
        </ul>

        <p className="text-sm">
          Fuente: TITSA (Transportes Interurbanos de Tenerife). Las líneas y horarios pueden cambiar; consulta
          siempre la web oficial.
        </p>
      </div>
      <ExcursionesBox ids={["traslado", "coche"]} titulo="¿Prefieres no depender de la guagua?" />
    </article>
  );
}
