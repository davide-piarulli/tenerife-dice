import { getAllArticles } from "@/lib/articles";
import { SITE } from "@/lib/constants";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Google News sitemap: only articles from the last 2 days (Google ignores older ones).
// The site is rebuilt on every publish, so this stays current.
export async function GET() {
  const articles = await getAllArticles();
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const recent = articles.filter((a) => new Date(a.date).getTime() >= cutoff).slice(0, 1000);

  const urls = recent
    .map((article) =>
      [
        "<url>",
        `<loc>${SITE.url}/noticias/${article.slug}/</loc>`,
        "<news:news>",
        "<news:publication>",
        `<news:name>${escapeXml(SITE.name)}</news:name>`,
        `<news:language>${SITE.language}</news:language>`,
        "</news:publication>",
        `<news:publication_date>${new Date(article.date).toISOString()}</news:publication_date>`,
        `<news:title>${escapeXml(article.title)}</news:title>`,
        "</news:news>",
        "</url>",
      ].join(""),
    )
    .join("");

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">' +
    urls +
    "</urlset>";

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
