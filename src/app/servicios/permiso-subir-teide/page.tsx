import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { getServicio } from "@/lib/servicios";

const servicio = getServicio("permiso-subir-teide")!;
const path = `/servicios/${servicio.slug}/`;
const REVISADO = "15 de noviembre de 2026";

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: path },
  openGraph: { title: servicio.title, description: servicio.description, url: `${SITE.url}${path}` },
};

const TARIFAS = [
  ["Residentes en Tenerife", "Gratis"],
  ["Menores de 14 años", "Gratis"],
  ["Residentes en el resto de Canarias", "6 €"],
  ["Visitantes de fuera de Canarias", "15 €"],
];

const FAQ = [
  {
    q: "¿Hace falta permiso para subir al pico del Teide?",
    a: "Sí. Para recorrer el sendero nº 10 (Telesforo Bravo), el último tramo desde La Rambleta hasta el pico, necesitas una autorización previa del Parque Nacional que se reserva en Tenerife ON. Con el teleférico, sin ese permiso, llegas solo hasta La Rambleta (3.555 m).",
  },
  {
    q: "¿Cuánto cuesta el permiso del Teide?",
    a: "Desde el 19 de enero de 2026 el Cabildo cobra una ecotasa: 15 € para visitantes de fuera de Canarias y 6 € para residentes en otras islas. Es gratis para residentes en Tenerife y menores de 14 años.",
  },
  {
    q: "¿El billete del teleférico incluye el permiso?",
    a: "No. El teleférico te sube hasta La Rambleta (3.555 m). Para continuar hasta el pico necesitas además el permiso del sendero nº 10.",
  },
  {
    q: "¿Se puede subir sin permiso?",
    a: "Las normas del Parque permiten a quienes duermen en el Refugio de Altavista llegar al pico antes de las 9:00 sin el permiso del sendero nº 10, con el justificante de su estancia. Confirma las condiciones vigentes con el propio refugio al reservar. Acceder sin autorización puede acarrear multas.",
  },
];

export default function PermisoTeidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: servicio.title,
    description: servicio.description,
    dateModified: "2026-11-15",
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@id": `${SITE.url}/#organization` },
    mainEntityOfPage: `${SITE.url}${path}`,
    inLanguage: "es",
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Guía práctica</p>
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-volcanic sm:text-4xl">
        {servicio.title}
      </h1>
      <p className="mt-3 text-lg text-ink/75">
        Todo lo que necesitas saber para llegar al pico del Teide (3.715 m): cómo reservar el permiso, cuánto
        cuesta, horarios y alternativas.
      </p>
      <p className="mt-2 text-sm text-muted">Información revisada el {REVISADO}.</p>

      <div className="mt-6 rounded-xl border-l-4 border-sunset bg-white p-4 shadow-sm">
        <p className="text-ink">
          <strong>Antes de ir:</strong> en invierno el Parque restringe varios senderos por encima de los 2.700 m
          por hielo y nieve, incluido el que sube al pico, y las carreteras de acceso (TF-21, TF-24, TF-38) se
          pueden cerrar. Comprueba el estado el mismo día en{" "}
          <a href="https://www.tenerifeon.es" target="_blank" rel="noopener noreferrer" className="text-ocean underline">
            Tenerife ON
          </a>{" "}
          y revisa los <Link href="/servicios/avisos-aemet-tenerife/" className="text-ocean underline">avisos de AEMET</Link>.
        </p>
      </div>

      <div className="prose-article mt-8">
        <h2>Cómo reservar el permiso</h2>
        <ol>
          <li>
            Entra en <a href="https://www.tenerifeon.es" target="_blank" rel="noopener noreferrer">tenerifeon.es</a>, la
            plataforma del Cabildo que gestiona las reservas desde 2025, y regístrate. La reserva se hace en la web,
            no en la app.
          </li>
          <li>
            Elige el sendero nº 10 Telesforo Bravo, el día y la franja horaria. Las plazas se abren cada lunes a las
            7:00 para las cuatro semanas siguientes y se agotan rápido en temporada alta.
          </li>
          <li>
            Añade los datos de todos los acompañantes (hasta 9 por solicitante) y paga la ecotasa si te corresponde.
          </li>
          <li>
            El día de la subida, todas las personas del permiso deben llevar su DNI o pasaporte original. Si el
            titular no se presenta o no se identifica, se anula el permiso de todo el grupo.
          </li>
        </ol>

        <h2>Precio del permiso en 2026</h2>
      </div>
      <table className="mt-3 w-full overflow-hidden rounded-xl bg-white text-left text-sm shadow-sm">
        <tbody>
          {TARIFAS.map(([quien, precio]) => (
            <tr key={quien} className="border-b border-black/5 last:border-0">
              <td className="p-3 text-ink">{quien}</td>
              <td className="p-3 font-semibold text-volcanic">{precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-sm text-muted">
        Ecotasa vigente desde el 19 de enero de 2026 en la franja de 9:00 a 17:00. No se devuelve salvo cierre del
        sendero por meteorología o si el teleférico no funciona.
      </p>

      <div className="prose-article mt-8">
        <h2>Horarios y normas en el sendero</h2>
        <ul>
          <li>
            Las subidas se reservan por franjas horarias dentro del horario de 9:00 a 17:00. Comprueba en Tenerife ON
            las franjas disponibles, porque el Cabildo ha anunciado cambios en su duración.
          </li>
          <li>No puede haber más de 50 personas a la vez en el sendero.</li>
          <li>Está prohibido entrar en el cráter o rodearlo: es zona de reserva.</li>
          <li>Solo se puede tener un permiso por persona y semana, y no se puede ceder a otra persona.</li>
          <li>No presentarse sin justificar puede suponer no poder volver a reservar durante tres meses.</li>
        </ul>

        <h2>Teleférico o a pie</h2>
        <p>
          La forma más habitual es subir en el teleférico hasta La Rambleta (3.555 m) y desde allí hacer a pie el
          último tramo, de unos 160 metros de desnivel. El billete del teleférico es aparte y <strong>no incluye el
          permiso</strong>. También se puede subir caminando desde Montaña Blanca, una ruta larga y exigente que
          en 2026 también tiene ecotasa para no residentes.
        </p>

        <h2>Alternativa: dormir en el Refugio de Altavista</h2>
        <p>
          El Refugio de Altavista, a 3.260 m, reabrió en julio de 2026 tras su reforma. Tiene 49 plazas y se reserva
          en <a href="https://www.refugioaltavista.com" target="_blank" rel="noopener noreferrer">refugioaltavista.com</a>.
          Las normas del Parque permiten a sus huéspedes llegar al pico antes de las 9:00 con el justificante de la
          estancia, sin el permiso del sendero nº 10. Confirma las condiciones al reservar.
        </p>

        <h2>Salud y seguridad</h2>
        <ul>
          <li>
            A más de 3.500 metros hay menos oxígeno: la subida no se recomienda a personas con problemas cardíacos o
            respiratorios ni con movilidad reducida.
          </li>
          <li>
            Calzado de montaña, protección solar, agua y ropa de abrigo: arriba puede hacer mucho frío aunque en la
            costa haga calor. Te pueden impedir el paso sin el equipo mínimo.
          </li>
          <li>El Parque puede cerrar el sendero por hielo, nieve o viento aunque tengas permiso.</li>
        </ul>

        <h2>Preguntas frecuentes</h2>
        {FAQ.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}

        <p className="text-sm">
          Fuentes: normas de acceso al Pico del Teide del Parque Nacional, Cabildo de Tenerife (Tenerife ON) e
          información publicada por RTVC y Diario de Avisos. Las condiciones pueden cambiar: la referencia oficial
          es siempre Tenerife ON.
        </p>
      </div>
    </article>
  );
}
