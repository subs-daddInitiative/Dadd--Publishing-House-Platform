import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getPublicBlogs, getPublicStudies, getPublicBlogCategories, type BlogSort } from "@/lib/serverApi";
import { BlogCard } from "@/features/blog/BlogCard";
import { BlogsFilters } from "@/features/blog/BlogsFilters";
import { Reveal } from "@/components/Reveal";
import { Sidebar } from "@/components/Sidebar";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "@/features/blog/blog.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.blogPage.title} | ${dictionary.common.siteName}`,
    description: dictionary.blogPage.subtitle,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}/blog`])),
    },
    openGraph: {
      title: dictionary.blogPage.title,
      description: dictionary.blogPage.subtitle,
      locale,
      type: "website",
    },
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; premium?: string; category?: string; search?: string; sort?: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const {
    page: pageParam,
    premium: premiumParam,
    category,
    search,
    sort: sortParam,
  } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const premium = premiumParam === "free" || premiumParam === "premium" ? premiumParam : undefined;
  const sort: BlogSort = sortParam === "oldest" ? "oldest" : "newest";

  const [dictionary, categories, blogList, recentStudiesResult] = await Promise.all([
    getDictionary(locale),
    getPublicBlogCategories(),
    getPublicBlogs({ page, premium, category, search, sort, locale }),
    getPublicStudies({ page: 1, locale }),
  ]);

  const { items, totalPages } = blogList;

  const pageQuery = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    if (premium) params.set("premium", premium);
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (sort !== "newest") params.set("sort", sort);
    return `?${params.toString()}`;
  };

  return (
    <>
      <section className={styles.blogHero}>
        <div className={styles.blogHeroBackdrop} aria-hidden="true" />
        <div className={styles.blogHeroBlobPrimary} aria-hidden="true" />
        <div className={styles.blogHeroBlobSecondary} aria-hidden="true" />
        <div className={`container ${styles.blogHeroInner}`}>
          <Reveal>
            <span className={styles.blogHeroBadge}>{dictionary.blogPage.heroBadge}</span>
            <h1 className={styles.blogHeroTitle}>{dictionary.blogPage.title}</h1>
            <p className={styles.blogHeroSubtitle}>{dictionary.blogPage.subtitle}</p>
          </Reveal>

          <Reveal delay={150} className={styles.blogHeroActions}>
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
              {dictionary.blogPage.subscribeCta}
            </Link>
            <BlogsFilters
              locale={locale}
              categories={categories}
              allLabel={dictionary.blogPage.filterAll}
              freeLabel={dictionary.blogPage.filterFree}
              premiumLabel={dictionary.blogPage.filterPremium}
              allCategoriesLabel={dictionary.blogPage.allCategories}
              sortNewestLabel={dictionary.blogPage.sortNewest}
              sortOldestLabel={dictionary.blogPage.sortOldest}
              searchPlaceholder={dictionary.blogPage.searchPlaceholder}
              searchButtonLabel={dictionary.blogPage.searchButton}
              resetLabel={dictionary.blogPage.resetFilters}
            />
          </Reveal>
        </div>
      </section>

      <section className={`container ${styles.page}`}>
        <div className={styles.layoutGrid}>
          <div className={styles.mainCol}>
            {items.length === 0 ? (
              <p className={styles.empty}>{dictionary.blogPage.empty}</p>
            ) : (
              <div className={styles.postsList}>
                {items.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    locale={locale}
                    blog={blog}
                    byLabel={dictionary.blogPage.by}
                    favoriteLabel={dictionary.booksPage.favorite}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav className={styles.pagination} aria-label="pagination">
                {page > 1 ? (
                  <Link href={`/${locale}/blog${pageQuery(page - 1)}`} className={styles.pageLink}>
                    {dictionary.blogPage.prev}
                  </Link>
                ) : (
                  <span className={styles.pageLinkDisabled}>{dictionary.blogPage.prev}</span>
                )}
                {page < totalPages ? (
                  <Link href={`/${locale}/blog${pageQuery(page + 1)}`} className={styles.pageLink}>
                    {dictionary.blogPage.next}
                  </Link>
                ) : (
                  <span className={styles.pageLinkDisabled}>{dictionary.blogPage.next}</span>
                )}
              </nav>
            )}
          </div>

          <Sidebar
            locale={locale}
            dictionary={dictionary}
            recentBlogs={items.slice(0, 5)}
            recentStudies={recentStudiesResult.items.slice(0, 5)}
          />
        </div>
      </section>
    </>
  );
}
