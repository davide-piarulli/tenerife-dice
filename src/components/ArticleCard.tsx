import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Article } from "@/types/article";
import { CategoryBadge } from "./CategoryBadge";

export function ArticleCard({
  article,
  priority = false,
  size = "default",
}: {
  article: Article;
  priority?: boolean;
  size?: "default" | "large";
}) {
  const isLarge = size === "large";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={`/noticias/${article.slug}`}
        className={`relative block overflow-hidden ${isLarge ? "aspect-[16/9]" : "aspect-[4/3]"}`}
      >
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          priority={priority}
          sizes={isLarge ? "(min-width: 1024px) 800px, 100vw" : "(min-width: 1024px) 380px, 100vw"}
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2">
          <CategoryBadge slug={article.category} />
          <time dateTime={article.date} className="text-xs text-muted">
            {format(new Date(article.date), "d MMM yyyy", { locale: es })}
          </time>
        </div>
        <h3
          className={`font-display font-bold leading-snug text-volcanic transition group-hover:text-ocean ${
            isLarge ? "text-2xl" : "text-lg"
          }`}
        >
          <Link href={`/noticias/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="line-clamp-2 text-sm text-ink/70">{article.excerpt}</p>
      </div>
    </article>
  );
}
