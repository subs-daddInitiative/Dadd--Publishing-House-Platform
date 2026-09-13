import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getPublicStudies, getPublicStudyCategories, getPublicBlogs, type StudySort } from "@/lib/serverApi";
import { StudyCard } from "@/features/studies/StudyCard";
import { StudiesFilters } from "@/features/studies/StudiesFilters";
import { Reveal } from "@/components/Reveal";
import { Sidebar } from "@/components/Sidebar";
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
  searchParams: Promise<{ page?: string; category?: string; sort?: string; premium?: string; search?: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const { page: pageParam, category, sort: sortParam, premium: premiumParam, search } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const sort: StudySort = sortParam === "oldest" ? "oldest" : "newest";
  const premium = premiumParam === "free" || premiumParam === "premium" ? premiumParam : undefined;

  const [dictionary, categories, studyList, recentBlogsResult] = await Promise.all([
    getDictionary(locale),
    getPublicStudyCategories(),
    getPublicStudies({ page, category, sort, premium, search, locale }),
    getPublicBlogs({ page: 1, locale }),
  ]);

  const { items, totalPages } = studyList;

  const pageQuery = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    if (category) params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    if (premium) params.set("premium", premium);
    if (search) params.set("search", search);
    return `?${params.toString()}`;
  };

  return (
    <>
      <section className={styles.studiesHero}>
        <div className={styles.studiesHeroBackdrop} aria-hidden="true" />
        <div className={styles.studiesHeroBlobPrimary} aria-hidden="true" />
        <div className={styles.studiesHeroBlobSecondary} aria-hidden="true" />
        <div className={`container ${styles.studiesHeroInner}`}>
          <Reveal>
            <span className={styles.studiesHeroBadge}>{dictionary.studiesPage.heroBadge}</span>
            <h1 className={styles.studiesHeroTitle}>{dictionary.studiesPage.title}</h1>
            <p className={styles.studiesHeroSubtitle}>{dictionary.studiesPage.subtitle}</p>
          </Reveal>

          <Reveal delay={150} className={styles.studiesHeroActions}>
            <Link href={`/${locale}/subscribe`} className={`${styles.heroSubscribeButton} hover-lift`}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3.5c-1 0-1.8.8-1.8 1.8v.6C7.5 6.6 5.5 9.2 5.5 12.3v3.4L4 18.2v1h16v-1l-1.5-2.5v-3.4c0-3.1-2-5.7-4.7-6.4v-.6c0-1-.8-1.8-1.8-1.8Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path d="M9.5 20a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {dictionary.studiesPage.subscribeCta}
            </Link>
            <StudiesFilters
              locale={locale}
              categories={categories}
              allCategoriesLabel={dictionary.studiesPage.allCategories}
              sortNewestLabel={dictionary.studiesPage.sortNewest}
              sortOldestLabel={dictionary.studiesPage.sortOldest}
              allLabel={dictionary.studiesPage.filterAll}
              freeLabel={dictionary.studiesPage.filterFree}
              premiumLabel={dictionary.studiesPage.filterPremium}
              searchPlaceholder={dictionary.studiesPage.searchPlaceholder}
              searchButtonLabel={dictionary.studiesPage.searchButton}
              resetLabel={dictionary.studiesPage.resetFilters}
            />
          </Reveal>
        </div>
      </section>

      <section className={`container ${styles.page}`}>
        <div className={styles.layoutGrid}>
          <div className={styles.mainCol}>
            {items.length === 0 ? (
              <p className={styles.empty}>{dictionary.studiesPage.empty}</p>
            ) : (
              <div className={styles.postsList}>
                {items.map((study) => (
                  <StudyCard
                    key={study.id}
                    locale={locale}
                    study={study}
                    byLabel={dictionary.studiesPage.by}
                    favoriteLabel={dictionary.booksPage.favorite}
                  />
                ))}
              </div>
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
          </div>

          <Sidebar
            locale={locale}
            dictionary={dictionary}
            recentStudies={items.slice(0, 5)}
            recentBlogs={recentBlogsResult.items.slice(0, 5)}
            categories={categories}
            categoriesBasePath="/studies"
            showSubscribeCta={false}
          />
        </div>
      </section>
    </>
  );
}
