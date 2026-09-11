export type ArticleFrontmatter = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  updated?: string;
  category: string;
  tags?: string[];
  image: string;
  imageAlt?: string;
  imageIsAI?: boolean;
  author: string;
  sourceName?: string;
  sourceUrl?: string;
  draft?: boolean;
  faq?: { question: string; answer: string }[];
};

export type Article = ArticleFrontmatter & {
  content: string;
  readingTime: string;
};
