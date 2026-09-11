import Link from "next/link";
import type { Article } from "@/types/article";

export function BreakingTicker({ article }: { article: Article }) {
  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="flex items-center gap-3 rounded-lg bg-volcanic px-4 py-2.5 text-sand transition hover:bg-volcanic-soft"
    >
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-sunset">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sunset" />
        Última hora
      </span>
      <span className="truncate text-sm font-semibold">{article.title}</span>
    </Link>
  );
}
