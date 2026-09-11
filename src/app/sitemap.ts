import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { CATEGORIES, SITE } from "@/lib/constants";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE.url}/noticias`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE.url}/sobre-nosotros`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE.url}/contacto`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE.url}/aviso-legal`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${SITE.url}/privacidad`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${SITE.url}/cookies`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE.url}/categoria/${c.slug}`,
    changeFrequency: "hourly",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE.url}/noticias/${a.slug}`,
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
