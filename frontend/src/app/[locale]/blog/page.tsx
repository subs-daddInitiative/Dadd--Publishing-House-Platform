import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getPublicBlogs } from "@/lib/serverApi";
import { BlogCard } from "@/features/blog/BlogCard";
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
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [dictionary, blogList] = await Promise.all([getDictionary(locale), getPublicBlogs(page)]);

  const { items, totalPages } = blogList;
  const isFirstPage = page === 1;
  const featured = isFirstPage ? items[0] : null;
  const compact = isFirstPage ? items.slice(1, 3) : [];
  const rest = isFirstPage ? items.slice(3) : items;

  return (
    <section className={`container ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{dictionary.blogPage.title}</h1>
          <p className={styles.pageSubtitle}>{dictionary.blogPage.subtitle}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>{dictionary.blogPage.empty}</p>
      ) : (
        <>
          {(featured || compact.length > 0) && (
            <div className={styles.bentoGrid}>
              {featured && (
                <BlogCard locale={locale} blog={featured} variant="featured" byLabel={dictionary.blogPage.by} />
              )}
              {compact.map((blog) => (
                <BlogCard key={blog.id} locale={locale} blog={blog} variant="compact" byLabel={dictionary.blogPage.by} />
              ))}
            </div>
          )}

          {rest.length > 0 && (
            <div className={styles.postsGrid}>
              {rest.map((blog) => (
                <BlogCard key={blog.id} locale={locale} blog={blog} variant="grid" byLabel={dictionary.blogPage.by} />
              ))}
            </div>
          )}
        </>
      )}

      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="pagination">
          {page > 1 ? (
            <Link href={`/${locale}/blog?page=${page - 1}`} className={styles.pageLink}>
              {dictionary.blogPage.prev}
            </Link>
          ) : (
            <span className={styles.pageLinkDisabled}>{dictionary.blogPage.prev}</span>
          )}
          {page < totalPages ? (
            <Link href={`/${locale}/blog?page=${page + 1}`} className={styles.pageLink}>
              {dictionary.blogPage.next}
            </Link>
          ) : (
            <span className={styles.pageLinkDisabled}>{dictionary.blogPage.next}</span>
          )}
        </nav>
      )}
    </section>
  );
}
