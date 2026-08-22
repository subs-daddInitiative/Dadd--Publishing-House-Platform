import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { formatCurrency } from "@/lib/currency";
import { StarRating } from "./StarRating";
import { BookCardActions } from "./BookCardActions";
import styles from "./books.module.css";

export type BookCardData = {
  id: number;
  slug: string;
  title: string;
  author: string | null;
  coverImageUrl: string | null;
  price: number | null;
  currency: string;
  rating: number | null;
  reviewsCount: number;
  categoryName: string | null;
};

type BookCardProps = {
  locale: Locale;
  book: BookCardData;
  addToCartLabel: string;
  favoriteLabel: string;
};

export function BookCard({ locale, book, addToCartLabel, favoriteLabel }: BookCardProps) {
  const href = `/${locale}/books/${book.slug}`;

  return (
    <div className={`${styles.card} hover-lift`}>
      <Link href={href} className={styles.cardImageLink}>
        <div className={styles.cardImageWrap}>
          {book.coverImageUrl ? (
            <Image
              src={book.coverImageUrl}
              alt={book.title}
              fill
              sizes="(max-width: 45rem) 50vw, 25vw"
              className={styles.cardImage}
            />
          ) : (
            <div className={styles.cardImageFallback} aria-hidden="true">
              {book.title.charAt(0)}
            </div>
          )}
          {book.categoryName && <span className={styles.cardCategoryTag}>{book.categoryName}</span>}
        </div>
      </Link>

      <div className={styles.cardBody}>
        <Link href={href} className={styles.cardTitleLink}>
          <h3 className={styles.cardTitle}>{book.title}</h3>
        </Link>
        {book.author && <p className={styles.cardAuthor}>{book.author}</p>}
        {book.rating !== null && <StarRating rating={book.rating} reviewsCount={book.reviewsCount} />}
        {book.price !== null && (
          <p className={styles.cardPrice}>{formatCurrency(book.price, book.currency)}</p>
        )}
        <BookCardActions
          book={{
            id: book.id,
            slug: book.slug,
            title: book.title,
            coverImageUrl: book.coverImageUrl,
            price: book.price,
            currency: book.currency,
          }}
          addToCartLabel={addToCartLabel}
          favoriteLabel={favoriteLabel}
        />
      </div>
    </div>
  );
}
