import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { BookSummary } from "@/lib/serverApi";
import { Reveal } from "@/components/Reveal";
import { BookCard } from "@/features/books/BookCard";
import { toBookCardData } from "@/features/books/mapBook";
import bookStyles from "@/features/books/books.module.css";
import styles from "./home.module.css";

type BooksSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
  books: BookSummary[];
};

export function BooksSection({ locale, dictionary, books }: BooksSectionProps) {
  if (books.length === 0) return null;

  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.highlightHeader}>
          <Reveal>
            <h2 className={styles.highlightTitle}>{dictionary.booksPage.title}</h2>
            <p className={styles.highlightSubtitle}>{dictionary.booksPage.subtitle}</p>
          </Reveal>
          <Reveal delay={100}>
            <Link href={`/${locale}/books`} className={bookStyles.viewAllLink}>
              {dictionary.booksPage.viewAll}
            </Link>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className={bookStyles.grid}>
            {books.map((book) => (
              <BookCard
                key={book.id}
                locale={locale}
                book={toBookCardData(book)}
                addToCartLabel={dictionary.booksPage.addToCart}
                favoriteLabel={dictionary.booksPage.favorite}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
