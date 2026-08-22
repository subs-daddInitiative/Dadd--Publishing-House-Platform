"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { FavoriteItem } from "@/lib/serverApi";
import { useStore } from "@/components/store/StoreProvider";
import { BookCard } from "@/features/books/BookCard";
import styles from "./subscribers.module.css";

type AccountFavoritesViewProps = {
  locale: Locale;
  dictionary: Dictionary;
  blogs: FavoriteItem[];
  studies: FavoriteItem[];
};

export function AccountFavoritesView({ locale, dictionary, blogs, studies }: AccountFavoritesViewProps) {
  const { favorites: favoriteBooks } = useStore();
  const [blogItems, setBlogItems] = useState(blogs);
  const [studyItems, setStudyItems] = useState(studies);

  async function removeFavorite(itemType: "blog" | "study", itemId: number) {
    if (itemType === "blog") setBlogItems((current) => current.filter((item) => item.id !== itemId));
    else setStudyItems((current) => current.filter((item) => item.id !== itemId));

    await fetch(`/api/subscriber/favorites/${itemType}/${itemId}`, { method: "DELETE" }).catch(() => {});
  }

  const isEmpty = favoriteBooks.length === 0 && blogItems.length === 0 && studyItems.length === 0;

  return (
    <div className={styles.accountPage}>
      <h1 className={styles.accountTitle}>{dictionary.accountPage.navFavorites}</h1>

      {isEmpty && <p className={styles.expiresText}>{dictionary.favoritesPage.emptyAll}</p>}

      {favoriteBooks.length > 0 && (
        <>
          <h2 className={styles.accountTitle}>{dictionary.favoritesPage.booksSectionTitle}</h2>
          <div className={styles.favoritesGrid}>
            {favoriteBooks.map((item) => (
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
        </>
      )}

      {blogItems.length > 0 && (
        <>
          <h2 className={styles.accountTitle}>{dictionary.favoritesPage.blogsSectionTitle}</h2>
          <ul className={styles.favoritesList}>
            {blogItems.map((item) => (
              <li key={item.id} className={styles.favoritesListItem}>
                <Link href={`/${locale}/blog/${item.slug}`}>{item.title}</Link>
                <button
                  type="button"
                  className={styles.removeFavoriteButton}
                  onClick={() => removeFavorite("blog", item.id)}
                >
                  {dictionary.booksPage.unfavorite}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {studyItems.length > 0 && (
        <>
          <h2 className={styles.accountTitle}>{dictionary.favoritesPage.studiesSectionTitle}</h2>
          <ul className={styles.favoritesList}>
            {studyItems.map((item) => (
              <li key={item.id} className={styles.favoritesListItem}>
                <Link href={`/${locale}/studies/${item.slug}`}>{item.title}</Link>
                <button
                  type="button"
                  className={styles.removeFavoriteButton}
                  onClick={() => removeFavorite("study", item.id)}
                >
                  {dictionary.booksPage.unfavorite}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
