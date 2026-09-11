import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Todas las noticias",
  description: "Todas las noticias de Tenerife publicadas en Tenerife Dice.",
  alternates: { canonical: "/noticias/" },
};

export default async function NoticiasPage() {
  const articles = await getAllArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-volcanic sm:text-3xl">
        Todas las noticias
      </h1>
      <p className="mt-1 text-sm text-muted">{articles.length} artículos publicados</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="mt-10 text-sm text-muted">Aún no hay noticias publicadas.</p>
      )}
    </div>
  );
}
