import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE } from "@/lib/pagination";

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  // output: "export" requires at least one static path even when there is no real page 2 yet;
  // the page component calls notFound() for any page number beyond totalPages.
  const count = Math.max(1, totalPages - 1);
  return Array.from({ length: count }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Todas las noticias — página ${page}`,
    alternates: { canonical: `/noticias/pagina/${page}/` },
    robots: { index: false, follow: true },
  };
}

export default async function NoticiasPagePaginated({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = Number(page);

  const articles = await getAllArticles();
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));

  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) {
    notFound();
  }

  const start = (pageNumber - 1) * PAGE_SIZE;
  const pageArticles = articles.slice(start, start + PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-volcanic sm:text-3xl">
        Todas las noticias
      </h1>
      <p className="mt-1 text-sm text-muted">
        {articles.length} artículos publicados — página {pageNumber} de {totalPages}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pageArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      <Pagination currentPage={pageNumber} totalPages={totalPages} basePath="/noticias" />
    </div>
  );
}
