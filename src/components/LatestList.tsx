import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Article } from "@/types/article";
import { CategoryBadge } from "./CategoryBadge";
import { TimeAgo } from "./TimeAgo";

export function LatestList({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <aside className="rounded-xl border border-black/10 bg-white">
      <div className="border-b border-black/10 px-4 py-3">
        <h2 className="font-display text-base font-bold text-volcanic">Lo último</h2>
      </div>
      <ol>
        {articles.map((article, i) => (
          <li key={article.slug}>
            <Link
              href={`/noticias/${article.slug}`}
              className="group flex gap-3 px-4 py-3 hover:bg-black/[0.03]"
            >
              <span className="font-display text-lg font-bold text-black/15 group-hover:text-ocean/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">
                <span className="flex items-center gap-2">
                  <CategoryBadge slug={article.category} className="!px-1.5 !py-0.5 !text-[10px]" />
                  <time dateTime={article.date} className="text-[11px] text-muted">
                    <TimeAgo
                      iso={article.date}
                      fallback={format(new Date(article.date), "d MMM", { locale: es })}
                    />
                  </time>
                </span>
                <span className="mt-1 block text-sm font-semibold leading-snug text-ink group-hover:text-ocean">
                  {article.title}
                </span>
              </span>
            </Link>
            {i < articles.length - 1 && <div className="mx-4 border-b border-black/5" />}
          </li>
        ))}
      </ol>
    </aside>
  );
}
