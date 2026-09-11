import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByCategory } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { CATEGORIES, getCategory } from "@/lib/constants";
import { PAGE_SIZE } from "@/lib/pagination";

export const dynamicParams = false;

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return {
    title: category.label,
    description: category.description,
    alternates: { canonical: `/categoria/${category.slug}/` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(slug);
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const pageArticles = articles.slice(0, PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-volcanic sm:text-3xl">
        {category.label}
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">{category.description}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pageArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="mt-10 text-sm text-muted">
          Aún no hay noticias publicadas en esta sección.
        </p>
      )}

      <Pagination
        currentPage={1}
        totalPages={totalPages}
        basePath={`/categoria/${category.slug}`}
      />
    </div>
  );
}
