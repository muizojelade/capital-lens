export const ARTICLE_CATEGORIES = [
  "Markets",
  "Investing",
  "Economy",
  "Crypto",
  "Commodities",
  "Finance 101",
] as const;

export type ArticleCategory =
  (typeof ARTICLE_CATEGORIES)[number];