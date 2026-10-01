// Keys must match ARTICLE_TYPES in backend/src/features/blogs/blogs.validation.js.
export const ARTICLE_TYPE_KEYS = ["news", "analysis", "opinion", "interview", "book_review"] as const;

export type ArticleTypeKey = (typeof ARTICLE_TYPE_KEYS)[number];

// Admin dashboard labels (the dashboard is Arabic-only); visitors see dictionary.blogPage.articleTypes.
export const ARTICLE_TYPE_ADMIN_LABELS: Record<ArticleTypeKey, string> = {
  news: "خبر",
  analysis: "تحليل",
  opinion: "رأي",
  interview: "مقابلة",
  book_review: "مراجعة كتاب",
};

export function isArticleTypeKey(value: string | null | undefined): value is ArticleTypeKey {
  return (ARTICLE_TYPE_KEYS as readonly string[]).includes(value ?? "");
}
