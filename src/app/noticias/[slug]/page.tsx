import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ShareButtons } from "@/components/ShareButtons";
import { getCategory, SITE } from "@/lib/constants";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const url = `${SITE.url}/noticias/${article.slug}/`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url,
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
      authors: [article.author],
      images: [{ url: article.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const related = await getRelatedArticles(article);
  const url = `${SITE.url}/noticias/${article.slug}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.image],
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    author: [{ "@type": "Organization", name: article.author }],
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: category?.label,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Portada", item: `${SITE.url}/` },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.label,
              item: `${SITE.url}/categoria/${category.slug}/`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: article.title,
        item: url,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav aria-label="Migas de pan" className="mb-4 text-xs text-muted">
        <Link href="/" className="hover:text-ocean">
          Portada
        </Link>
        {category && (
          <>
            {" / "}
            <Link href={`/categoria/${category.slug}`} className="hover:text-ocean">
              {category.label}
            </Link>
          </>
        )}
      </nav>

      <div className="mb-4 flex items-center gap-3">
        <CategoryBadge slug={article.category} />
        <time dateTime={article.date} className="text-xs text-muted">
          {format(new Date(article.date), "d MMMM yyyy, HH:mm", { locale: es })}
        </time>
        <span className="text-xs text-muted">· {article.readingTime}</span>
      </div>

      <h1 className="font-display text-3xl font-bold leading-tight text-volcanic sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-4 text-lg text-ink/75">{article.excerpt}</p>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl">
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
      </div>
      {article.imageIsAI && (
        <p className="mt-1.5 text-right text-xs text-muted">
          Imagen ilustrativa generada con inteligencia artificial
        </p>
      )}

      <div
        className="prose-article mt-8"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.sourceUrl && (
        <p className="mt-8 rounded-lg border border-black/10 bg-white/60 px-4 py-3 text-sm text-muted">
          Información basada en datos publicados originalmente por{" "}
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-semibold text-ocean hover:underline"
          >
            {article.sourceName ?? "la fuente original"}
          </a>
          . Redacción propia de {SITE.name}.
        </p>
      )}

      <p className="mt-3 text-xs text-muted">Por {article.author} — {SITE.name}</p>

      <div className="mt-6 border-t border-black/10 pt-6">
        <ShareButtons url={url} title={article.title} />
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 border-b-2 border-volcanic pb-2 font-display text-xl font-bold text-volcanic">
            Sigue leyendo
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((r) => (
              <ArticleCard key={r.slug} article={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
