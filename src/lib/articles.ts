import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";
import type { Article, ArticleFrontmatter } from "@/types/article";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function isPublished(fm: ArticleFrontmatter, includeDrafts: boolean) {
  if (includeDrafts) return true;
  if (fm.draft) return false;
  return new Date(fm.date).getTime() <= Date.now();
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fullPathMd = path.join(ARTICLES_DIR, `${slug}.md`);
  const fullPathMdx = path.join(ARTICLES_DIR, `${slug}.mdx`);
  const fullPath = fs.existsSync(fullPathMd)
    ? fullPathMd
    : fs.existsSync(fullPathMdx)
      ? fullPathMdx
      : null;
  if (!fullPath) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as ArticleFrontmatter;

  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content);

  return {
    ...fm,
    slug: fm.slug ?? slug,
    content: processed.toString(),
    readingTime: `${Math.max(1, Math.round(readingTime(content).minutes))} min de lectura`,
  };
}

export async function getAllArticles(
  { includeDrafts = false }: { includeDrafts?: boolean } = {},
): Promise<Article[]> {
  const slugs = getArticleSlugs();
  const articles = await Promise.all(slugs.map((slug) => getArticleBySlug(slug)));
  return articles
    .filter((a): a is Article => a !== null && isPublished(a, includeDrafts))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.category === category);
}

export async function getLatestArticles(count: number): Promise<Article[]> {
  const all = await getAllArticles();
  return all.slice(0, count);
}

export async function getRelatedArticles(current: Article, count = 3): Promise<Article[]> {
  const all = await getAllArticles();
  return all
    .filter((a) => a.slug !== current.slug && a.category === current.category)
    .slice(0, count);
}
