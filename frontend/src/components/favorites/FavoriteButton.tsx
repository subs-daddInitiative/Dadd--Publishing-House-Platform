"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { useFavorites } from "./FavoritesProvider";
import styles from "./FavoriteButton.module.css";

type FavoriteButtonProps = {
  locale: Locale;
  itemType: "blog" | "study";
  itemId: number;
  label: string;
};

export function FavoriteButton({ locale, itemType, itemId, label }: FavoriteButtonProps) {
  const router = useRouter();
  const { isLoggedIn, isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(itemType, itemId);

  return (
    <button
      type="button"
      className={`${styles.button} ${favorite ? styles.active : ""}`}
      aria-pressed={favorite}
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isLoggedIn) {
          router.push(`/${locale}/login`);
          return;
        }
        toggleFavorite(itemType, itemId);
      }}
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
  );
}
