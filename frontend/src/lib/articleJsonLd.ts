import { ORGANIZATION_ID, absoluteUrl } from "@/lib/siteUrl";

type ArticleJsonLdInput = {
  headline: string;
  description?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  updatedAt: string;
  authorName?: string | null;
  path: string;
  locale: string;
  isPremium: boolean;
  keywords?: string | null;
  section?: string | null;
  doi?: string | null;
  reportNumber?: string | null;
  seriesNumber?: string | null;
  type?: "Article" | "ScholarlyArticle";
};

// Splits the admin's comma-separated keywords (Arabic or Latin comma) into a clean list.
function splitKeywords(raw?: string | null): string[] {
  return (raw || "")
    .split(/[,،]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  const keywords = splitKeywords(input.keywords);
  const identifiers = [
    input.doi && { "@type": "PropertyValue", propertyID: "DOI", value: input.doi },
    input.reportNumber && { "@type": "PropertyValue", propertyID: "reportNumber", value: input.reportNumber },
    input.seriesNumber && { "@type": "PropertyValue", propertyID: "seriesNumber", value: input.seriesNumber },
  ].filter(Boolean);
  const doiUrl = input.doi ? `https://doi.org/${input.doi}` : undefined;
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "Article",
    headline: input.headline,
    description: input.description || undefined,
    image: input.imageUrl ? [input.imageUrl] : undefined,
    datePublished: input.publishedAt || undefined,
    dateModified: input.updatedAt,
    inLanguage: input.locale,
    isAccessibleForFree: !input.isPremium,
    articleSection: input.section || undefined,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    identifier: identifiers.length > 0 ? identifiers : undefined,
    sameAs: doiUrl,
    author: input.authorName ? { "@type": "Person", name: input.authorName } : undefined,
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(input.path) },
  };
}
