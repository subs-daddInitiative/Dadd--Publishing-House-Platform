"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { useStore } from "@/components/store/StoreProvider";
import { BookCard } from "./BookCard";
import styles from "./books.module.css";

type FavouritesViewProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function FavouritesView({ locale, dictionary }: FavouritesViewProps) {
  const { favorites } = useStore();

  if (favorites.length === 0) {
    return (
      <div className={`container ${styles.page}`}>
        <h1 className={styles.pageTitle}>{dictionary.favoritesPage.title}</h1>
        <p className={styles.empty}>{dictionary.favoritesPage.empty}</p>
        <Link href={`/${locale}/books`} className={styles.postActionPrimary}>
          {dictionary.favoritesPage.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.pageTitle}>{dictionary.favoritesPage.title}</h1>
      <div className={styles.grid}>
        {favorites.map((item) => (
          <BookCard
            key={item.id}
            locale={locale}
            book={{
              id: item.id,
              slug: item.slug,
              title: item.title,
              author: null,
              coverImageUrl: item.coverImageUrl,
              price: item.price,
              currency: item.currency,
              rating: null,
              reviewsCount: 0,
              categoryName: null,
            }}
            addToCartLabel={dictionary.booksPage.addToCart}
            favoriteLabel={dictionary.booksPage.favorite}
          />
        ))}
      </div>
    </div>
  );
}
