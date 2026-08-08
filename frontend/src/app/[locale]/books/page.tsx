import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getPublicBooks, getPublicBookCategories, type BookSort } from "@/lib/serverApi";
import { BookCard } from "@/features/books/BookCard";
import { BooksFilters } from "@/features/books/BooksFilters";
import { toBookCardData } from "@/features/books/mapBook";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "@/features/books/books.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.booksPage.title} | ${dictionary.common.siteName}`,
    description: dictionary.booksPage.subtitle,
    alternates: {
      canonical: `/${locale}/books`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}/books`])),
    },
    openGraph: {
      title: dictionary.booksPage.title,
      description: dictionary.booksPage.subtitle,
      locale,
      type: "website",
    },
  };
}

export default async function BooksPage({
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
  const validSorts: BookSort[] = ["newest", "oldest", "price_asc", "price_desc"];
  const sort: BookSort = validSorts.includes(sortParam as BookSort) ? (sortParam as BookSort) : "newest";

  const [dictionary, categories, bookList] = await Promise.all([
    getDictionary(locale),
    getPublicBookCategories(),
    getPublicBooks({ page, category, sort }),
  ]);

  const { items, totalPages } = bookList;

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
          <h1 className={styles.pageTitle}>{dictionary.booksPage.title}</h1>
          <p className={styles.pageSubtitle}>{dictionary.booksPage.subtitle}</p>
        </div>
      </div>

      <BooksFilters
        locale={locale}
        categories={categories}
        allCategoriesLabel={dictionary.booksPage.allCategories}
        sortNewestLabel={dictionary.booksPage.sortNewest}
        sortOldestLabel={dictionary.booksPage.sortOldest}
        sortPriceAscLabel={dictionary.booksPage.sortPriceAsc}
        sortPriceDescLabel={dictionary.booksPage.sortPriceDesc}
      />

      {items.length === 0 ? (
        <p className={styles.empty}>{dictionary.booksPage.empty}</p>
      ) : (
        <div className={styles.grid}>
          {items.map((book) => (
            <BookCard
              key={book.id}
              locale={locale}
              book={toBookCardData(book)}
              addToCartLabel={dictionary.booksPage.addToCart}
              favoriteLabel={dictionary.booksPage.favorite}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="pagination">
          {page > 1 ? (
            <Link href={`/${locale}/books${pageQuery(page - 1)}`} className={styles.pageLink}>
              {dictionary.booksPage.prev}
            </Link>
          ) : (
            <span className={styles.pageLinkDisabled}>{dictionary.booksPage.prev}</span>
          )}
          {page < totalPages ? (
            <Link href={`/${locale}/books${pageQuery(page + 1)}`} className={styles.pageLink}>
              {dictionary.booksPage.next}
            </Link>
          ) : (
            <span className={styles.pageLinkDisabled}>{dictionary.booksPage.next}</span>
          )}
        </nav>
      )}
    </section>
  );
}
