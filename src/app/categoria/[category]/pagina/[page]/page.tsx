import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByCategory } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { CATEGORIES, getCategory } from "@/lib/constants";
import { PAGE_SIZE } from "@/lib/pagination";

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { category: string; page: string }[] = [];
  for (const c of CATEGORIES) {
    const articles = await getArticlesByCategory(c.slug);
    const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
    for (let p = 2; p <= totalPages; p++) {
      params.push({ category: c.slug, page: String(p) });
    }
  }
  // output: "export" requires at least one static path for this route even when no
  // category has a real page 2 yet; the page component calls notFound() otherwise.
  if (params.length === 0) params.push({ category: CATEGORIES[0].slug, page: "2" });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}): Promise<Metadata> {
  const { category: slug, page } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return {
    title: `${category.label} — página ${page}`,
    alternates: { canonical: `/categoria/${category.slug}/pagina/${page}/` },
    robots: { index: false, follow: true },
  };
}

export default async function CategoryPagePaginated({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category: slug, page } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const pageNumber = Number(page);
  const articles = await getArticlesByCategory(slug);
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));

  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) {
    notFound();
  }

  const start = (pageNumber - 1) * PAGE_SIZE;
  const pageArticles = articles.slice(start, start + PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-volcanic sm:text-3xl">
        {category.label}
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        {category.description} — página {pageNumber} de {totalPages}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pageArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      <Pagination
        currentPage={pageNumber}
        totalPages={totalPages}
        basePath={`/categoria/${category.slug}`}
      />
    </div>
  );
}
