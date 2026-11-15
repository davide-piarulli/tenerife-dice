import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/articles";
import { AUTORES, getAutor, getAutorPorSlug } from "@/lib/autores";
import { SITE } from "@/lib/constants";

export const dynamicParams = false;

export function generateStaticParams() {
  return AUTORES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const autor = getAutorPorSlug(slug);
  if (!autor) return {};
  return {
    title: autor.nombre,
    description: autor.bio[0],
    alternates: { canonical: `/autor/${autor.slug}/` },
  };
}

export default async function AutorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const autor = getAutorPorSlug(slug);
  if (!autor) notFound();

  const articulos = (await getAllArticles()).filter((a) => getAutor(a.author).slug === autor.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": autor.tipo,
      name: autor.nombre,
      description: autor.bio.join(" "),
      url: `${SITE.url}/autor/${autor.slug}/`,
      ...(autor.tipo === "Person" ? { jobTitle: autor.cargo, worksFor: { "@id": `${SITE.url}/#organization` } } : {}),
      ...(autor.sameAs?.length ? { sameAs: autor.sameAs } : {}),
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">{autor.cargo}</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-volcanic">{autor.nombre}</h1>
        <div className="prose-article mt-4">
          {autor.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <h2 className="mt-10 font-display text-xl font-bold text-volcanic">
        Últimos artículos ({articulos.length})
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articulos.slice(0, 24).map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  );
}
