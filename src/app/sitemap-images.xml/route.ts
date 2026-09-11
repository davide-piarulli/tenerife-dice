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

export async function GET() {
  const articles = await getAllArticles();

  const urls = articles
    .map((article) => {
      const pageUrl = `${SITE.url}/noticias/${article.slug}/`;
      const imageUrl = article.image.startsWith("http")
        ? article.image
        : `${SITE.url}${article.image}`;
      const caption = article.imageAlt ?? article.title;
      return (
        "<url>" +
        `<loc>${pageUrl}</loc>` +
        "<image:image>" +
        `<image:loc>${escapeXml(imageUrl)}</image:loc>` +
        `<image:title>${escapeXml(article.title)}</image:title>` +
        `<image:caption>${escapeXml(caption)}</image:caption>` +
        "</image:image>" +
        "</url>"
      );
    })
    .join("");

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' +
    urls +
    "</urlset>";

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
