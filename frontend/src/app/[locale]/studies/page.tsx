import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getPublicStudies, getPublicStudyCategories, type StudySort } from "@/lib/serverApi";
import { StudyCard } from "@/features/studies/StudyCard";
import { StudiesFilters } from "@/features/studies/StudiesFilters";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "@/features/studies/studies.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.studiesPage.title} | ${dictionary.common.siteName}`,
    description: dictionary.studiesPage.subtitle,
    alternates: {
      canonical: `/${locale}/studies`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}/studies`])),
    },
    openGraph: {
      title: dictionary.studiesPage.title,
      description: dictionary.studiesPage.subtitle,
      locale,
      type: "website",
    },
  };
}

export default async function StudiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string; sort?: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const { page: pageParam, category, sort: sortParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const sort: StudySort = sortParam === "oldest" ? "oldest" : "newest";

  const [dictionary, categories, studyList] = await Promise.all([
    getDictionary(locale),
    getPublicStudyCategories(),
    getPublicStudies({ page, category, sort }),
  ]);

  const { items, totalPages } = studyList;
  const isFirstPage = page === 1;
  const featured = isFirstPage ? items[0] : null;
  const compact = isFirstPage ? items.slice(1, 3) : [];
  const rest = isFirstPage ? items.slice(3) : items;

  const pageQuery = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    if (category) params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    return `?${params.toString()}`;
  };

  return (
    <section className={`container ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{dictionary.studiesPage.title}</h1>
          <p className={styles.pageSubtitle}>{dictionary.studiesPage.subtitle}</p>
        </div>
      </div>

      <StudiesFilters
        locale={locale}
        categories={categories}
        allCategoriesLabel={dictionary.studiesPage.allCategories}
        sortNewestLabel={dictionary.studiesPage.sortNewest}
        sortOldestLabel={dictionary.studiesPage.sortOldest}
      />

      {items.length === 0 ? (
        <p className={styles.empty}>{dictionary.studiesPage.empty}</p>
      ) : (
        <>
          {(featured || compact.length > 0) && (
            <div className={styles.bentoGrid}>
              {featured && (
                <StudyCard locale={locale} study={featured} variant="featured" byLabel={dictionary.studiesPage.by} />
              )}
              {compact.map((study) => (
                <StudyCard key={study.id} locale={locale} study={study} variant="compact" byLabel={dictionary.studiesPage.by} />
              ))}
            </div>
          )}

          {rest.length > 0 && (
            <div className={styles.postsGrid}>
              {rest.map((study) => (
                <StudyCard key={study.id} locale={locale} study={study} variant="grid" byLabel={dictionary.studiesPage.by} />
              ))}
            </div>
          )}
        </>
      )}

      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="pagination">
          {page > 1 ? (
            <Link href={`/${locale}/studies${pageQuery(page - 1)}`} className={styles.pageLink}>
              {dictionary.studiesPage.prev}
            </Link>
          ) : (
            <span className={styles.pageLinkDisabled}>{dictionary.studiesPage.prev}</span>
          )}
          {page < totalPages ? (
            <Link href={`/${locale}/studies${pageQuery(page + 1)}`} className={styles.pageLink}>
              {dictionary.studiesPage.next}
            </Link>
          ) : (
            <span className={styles.pageLinkDisabled}>{dictionary.studiesPage.next}</span>
          )}
        </nav>
      )}
    </section>
  );
}
