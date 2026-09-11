"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import type { Article } from "@/types/article";
import { ArticleCard } from "./ArticleCard";

type SearchableArticle = Omit<Article, "content">;

export function SearchClient({ index }: { index: SearchableArticle[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "title", weight: 3 },
          { name: "excerpt", weight: 1.5 },
          { name: "tags", weight: 1.5 },
          { name: "category", weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [index],
  );

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    return fuse.search(trimmed).map((r) => r.item);
  }, [fuse, query]);

  return (
    <div>
      <label htmlFor="search-input" className="sr-only">
        Buscar noticias
      </label>
      <input
        id="search-input"
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca por título, tema o etiqueta…"
        className="w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-base text-ink placeholder:text-muted focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30"
      />

      <div className="mt-8">
        {query.trim().length >= 2 && (
          <p className="mb-4 text-sm text-muted">
            {results.length === 0
              ? "Sin resultados."
              : `${results.length} resultado${results.length === 1 ? "" : "s"} para "${query.trim()}"`}
          </p>
        )}

        {results.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
