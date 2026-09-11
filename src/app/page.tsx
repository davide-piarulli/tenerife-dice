import Link from "next/link";
import { getAllArticles, getArticlesByCategory } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { LatestList } from "@/components/LatestList";
import { BreakingTicker } from "@/components/BreakingTicker";
import { CATEGORIES } from "@/lib/constants";
import { isRecent } from "@/lib/time";

export default async function HomePage() {
  const articles = await getAllArticles();
  const [hero, ...rest] = articles;
  const secondary = rest.slice(0, 4);
  const sidebar = rest.slice(0, 7);
  const more = rest.slice(4, 10);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {articles.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {hero && isRecent(hero.date) && (
            <div className="mb-6">
              <BreakingTicker article={hero} />
            </div>
          )}

          <section aria-label="Destacados" className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {hero && <ArticleCard article={hero} priority size="large" />}
              {secondary.length > 0 && (
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {secondary.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <LatestList articles={sidebar} />
            </div>
          </section>

          {more.length > 0 && (
            <section className="mt-12">
              <SectionHeading title="Más noticias" href="/noticias" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {CATEGORIES.map((category) => (
        <CategorySection key={category.slug} slug={category.slug} label={category.label} />
      ))}
    </div>
  );
}

function SectionHeading({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between border-b-2 border-volcanic pb-2">
      <h2 className="font-display text-xl font-bold text-volcanic">{title}</h2>
      {href && (
        <Link href={href} className="text-sm font-semibold text-ocean hover:underline">
          Ver todas →
        </Link>
      )}
    </div>
  );
}

async function CategorySection({ slug, label }: { slug: string; label: string }) {
  const articles = (await getArticlesByCategory(slug)).slice(0, 3);
  if (articles.length === 0) return null;

  return (
    <section className="mt-12">
      <SectionHeading title={label} href={`/categoria/${slug}`} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-black/15 bg-white/60 px-6 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-volcanic">
        Tenerife Dice está a punto de arrancar
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink/70">
        Todavía no hay noticias publicadas. Añade el primer artículo en{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5">content/articles</code> para verlo
        aquí.
      </p>
    </div>
  );
}
