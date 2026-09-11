import type { Metadata } from "next";
import Link from "next/link";
import { getLatestArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const latest = await getLatestArticles(3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <LogoMark className="mx-auto h-14 w-14" />
      <p className="mt-6 font-display text-6xl font-bold text-volcanic">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-volcanic">
        Esta página se ha perdido por el Teide
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink/70">
        El enlace que has seguido no existe o la noticia ya no está disponible. Prueba a
        volver a la portada o echa un vistazo a lo último que hemos publicado.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-ocean px-5 py-2.5 text-sm font-semibold text-sand hover:bg-ocean-dark"
      >
        Volver a la portada
      </Link>

      {latest.length > 0 && (
        <div className="mt-14 text-left">
          <h2 className="mb-5 border-b-2 border-volcanic pb-2 font-display text-xl font-bold text-volcanic">
            Lo último en Tenerife Dice
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
