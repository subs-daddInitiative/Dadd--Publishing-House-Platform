import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getPublicBookBySlug, getPublicSettings, backendAssetUrl } from "@/lib/serverApi";
import { formatCurrency } from "@/lib/currency";
import { notFound } from "next/navigation";
import { StarRating } from "@/features/books/StarRating";
import { BookCardActions } from "@/features/books/BookCardActions";
import { BookCard } from "@/features/books/BookCard";
import { toBookCardData } from "@/features/books/mapBook";
import styles from "@/features/books/books.module.css";

type PageParams = { locale: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params;
  if (!isLocale(locale)) return {};
  const slug = decodeURIComponent(rawSlug);

  const [book, settings] = await Promise.all([getPublicBookBySlug(slug), getPublicSettings()]);
  if (!book) return {};

  const siteName = settings?.siteName || "";
  const description = book.description || undefined;
  const imageUrl = backendAssetUrl(book.cover_image);

  return {
    title: `${book.title} | ${siteName}`,
    description,
    alternates: {
      canonical: `/${locale}/books/${book.slug}`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}/books/${book.slug}`])),
    },
    openGraph: {
      title: book.title,
      description,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BookDetailPage({ params }: { params: Promise<PageParams> }) {
  const { locale: rawLocale, slug: rawSlug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const slug = decodeURIComponent(rawSlug);

  const [dictionary, book, settings] = await Promise.all([
    getDictionary(locale),
    getPublicBookBySlug(slug),
    getPublicSettings(),
  ]);

  if (!book) notFound();

  const siteName = settings?.siteName || dictionary.common.siteName;
  const coverImageUrl = backendAssetUrl(book.cover_image);
  const price = book.price !== null ? Number(book.price) : null;
  const rating = book.rating !== null ? Number(book.rating) : null;
  const canonicalPath = `/${locale}/books/${book.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: book.title,
    image: coverImageUrl ? [coverImageUrl] : undefined,
    description: book.description || undefined,
    brand: { "@type": "Organization", name: siteName },
    offers:
      price !== null
        ? {
            "@type": "Offer",
            price: price.toFixed(2),
            priceCurrency: book.currency,
            availability: "https://schema.org/InStock",
            url: canonicalPath,
          }
        : undefined,
    aggregateRating:
      rating !== null && book.reviews_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: rating.toFixed(1),
            reviewCount: book.reviews_count,
          }
        : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dictionary.booksPage.breadcrumbHome, item: `/${locale}` },
      { "@type": "ListItem", position: 2, name: dictionary.booksPage.breadcrumbBooks, item: `/${locale}/books` },
      { "@type": "ListItem", position: 3, name: book.title, item: canonicalPath },
    ],
  };

  return (
    <article className={`container ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className={styles.breadcrumb} aria-label="breadcrumb">
        <Link href={`/${locale}`}>{dictionary.booksPage.breadcrumbHome}</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${locale}/books`}>{dictionary.booksPage.breadcrumbBooks}</Link>
        <span aria-hidden="true">/</span>
        <span>{book.title}</span>
      </nav>

      <div className={styles.detailGrid}>
        <div className={styles.detailImageWrap}>
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={book.title}
              fill
              sizes="(max-width: 45rem) 100vw, 28rem"
              className={styles.detailImage}
              priority
            />
          ) : null}
        </div>

        <div className={styles.detailInfo}>
          {book.category_name && <span className={styles.detailCategoryTag}>{book.category_name}</span>}
          <h1 className={styles.detailTitle}>{book.title}</h1>
          {book.author && <p className={styles.detailAuthor}>{dictionary.booksPage.by} {book.author}</p>}
          {rating !== null && <StarRating rating={rating} reviewsCount={book.reviews_count} />}
          {price !== null && (
            <p className={styles.detailPrice}>{formatCurrency(price, book.currency)}</p>
          )}
          {book.description && <p className={styles.detailDescription}>{book.description}</p>}

          <div className={styles.detailActions}>
            <BookCardActions
              book={{
                id: book.id,
                slug: book.slug,
                title: book.title,
                coverImageUrl,
                price,
                currency: book.currency,
              }}
              addToCartLabel={dictionary.booksPage.addToCart}
              favoriteLabel={dictionary.booksPage.favorite}
            />
          </div>

          {book.external_links.length > 0 && (
            <div className={styles.externalLinksBlock}>
              <p className={styles.externalLinksTitle}>{dictionary.booksPage.buyExternally}</p>
              <div className={styles.externalLinksList}>
                {book.external_links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={styles.externalLinkButton}
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {book.related.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>{dictionary.booksPage.relatedBooks}</h2>
          <div className={styles.grid}>
            {book.related.map((related) => (
              <BookCard
                key={related.id}
                locale={locale}
                book={toBookCardData(related)}
                addToCartLabel={dictionary.booksPage.addToCart}
                favoriteLabel={dictionary.booksPage.favorite}
              />
            ))}
          </div>
        </section>
      )}

      <div className={styles.postActions}>
        <Link href={`/${locale}`} className={styles.postActionPrimary}>
          {dictionary.booksPage.backHome}
        </Link>
        <Link href={`/${locale}/books`} className={styles.postActionSecondary}>
          {dictionary.booksPage.moreBooks}
        </Link>
      </div>
    </article>
  );
}
