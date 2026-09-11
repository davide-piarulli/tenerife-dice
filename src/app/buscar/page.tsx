import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllArticles } from "@/lib/articles";
import { SearchClient } from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca noticias en Tenerife Dice por título, tema o etiqueta.",
  alternates: { canonical: "/buscar/" },
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  const articles = await getAllArticles();
  const index = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    date: article.date,
    category: article.category,
    tags: article.tags,
    image: article.image,
    imageAlt: article.imageAlt,
    imageIsAI: article.imageIsAI,
    author: article.author,
    sourceName: article.sourceName,
    sourceUrl: article.sourceUrl,
    readingTime: article.readingTime,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-volcanic sm:text-3xl">
        Buscar
      </h1>
      <p className="mt-1 text-sm text-muted">
        Busca entre {articles.length} noticias publicadas.
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <SearchClient index={index} />
        </Suspense>
      </div>
    </div>
  );
}
