"use client";

import { useStore, type StoreItem } from "@/components/store/StoreProvider";
import styles from "./books.module.css";

type BookCardActionsProps = {
  book: StoreItem;
  addToCartLabel: string;
  favoriteLabel: string;
};

export function BookCardActions({ book, addToCartLabel, favoriteLabel }: BookCardActionsProps) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const favorite = isFavorite(book.id);

  return (
    <div className={styles.cardActions}>
      <button
        type="button"
        className={styles.addToCartButton}
        onClick={(event) => {
          event.preventDefault();
          addToCart(book);
        }}
      >
        {addToCartLabel}
      </button>
      <button
        type="button"
        className={`${styles.favoriteButton} ${favorite ? styles.favoriteButtonActive : ""}`}
        onClick={(event) => {
          event.preventDefault();
          toggleFavorite(book);
        }}
        aria-pressed={favorite}
        aria-label={favoriteLabel}
      >
        <svg viewBox="0 0 24 24" fill={favorite ? "currentColor" : "none"} aria-hidden="true">
          <path
            d="M12 20.5s-7-4.5-9.5-9C.6 8 2 4.5 5.3 4.5c2 0 3.4 1 4.7 2.7C11.3 5.5 12.7 4.5 14.7 4.5 18 4.5 19.4 8 17.5 11.5c-2.5 4.5-9.5 9-9.5 9Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
