import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { SITE } from "@/lib/constants";
import { getArticulosPorMunicipio, getMunicipio, getMunicipiosConPagina } from "@/lib/municipios";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getMunicipiosConPagina()).map(({ m }) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getMunicipio(slug);
  if (!m) return {};
  const title = `Noticias de ${m.nombre} hoy`;
  const description = `Últimas noticias de ${m.nombre} (${m.zona.toLowerCase()} de Tenerife): actualidad, sucesos, cultura y servicios del municipio, actualizadas cada día.`;
  return {
    title,
    description,
    alternates: { canonical: `/municipio/${m.slug}/` },
    openGraph: { title, description, url: `${SITE.url}/municipio/${m.slug}/` },
  };
}

export default async function MunicipioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMunicipio(slug);
  if (!m) notFound();
  const articulos = (await getArticulosPorMunicipio()).get(m.slug) ?? [];
  const otros = (await getMunicipiosConPagina()).filter((x) => x.m.slug !== m.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/municipios/" className="hover:text-ocean">Municipios</Link> · {m.zona}
      </nav>
      <h1 className="mt-1 font-display text-2xl font-bold text-volcanic sm:text-3xl">Noticias de {m.nombre}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Todo lo que hemos publicado sobre {m.nombre}, de lo más reciente a lo más antiguo.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articulos.slice(0, 30).map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>

      {otros.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-lg font-bold text-volcanic">Otros municipios</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {otros.map(({ m: o }) => (
              <li key={o.slug}>
                <Link href={`/municipio/${o.slug}/`} className="inline-block rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-black/10 hover:ring-ocean">
                  {o.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
