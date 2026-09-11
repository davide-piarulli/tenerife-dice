import { getAllArticles } from "@/lib/articles";
import { getCategory, SITE } from "@/lib/constants";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await getAllArticles();

  const items = articles
    .slice(0, 30)
    .map((article) => {
      const url = `${SITE.url}/noticias/${article.slug}/`;
      const category = getCategory(article.category);
      return [
        "<item>",
        `<title>${escapeXml(article.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${new Date(article.date).toUTCString()}</pubDate>`,
        `<description>${escapeXml(article.excerpt)}</description>`,
        category ? `<category>${escapeXml(category.label)}</category>` : "",
        `<dc:creator>${escapeXml(article.author)}</dc:creator>`,
        "</item>",
      ]
        .filter(Boolean)
        .join("");
    })
    .join("");

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">' +
    "<channel>" +
    `<title>${escapeXml(SITE.name)}</title>` +
    `<link>${SITE.url}/</link>` +
    `<description>${escapeXml(SITE.description)}</description>` +
    `<language>${SITE.language}</language>` +
    `<atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />` +
    items +
    "</channel>" +
    "</rss>";

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
