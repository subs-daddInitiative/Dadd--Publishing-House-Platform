"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { useStore } from "@/components/store/StoreProvider";
import styles from "./HeaderStoreActions.module.css";

type HeaderStoreActionsProps = {
  locale: Locale;
  cartLabel: string;
  favoritesLabel: string;
};

export function HeaderStoreActions({ locale, cartLabel, favoritesLabel }: HeaderStoreActionsProps) {
  const { cartCount, favoritesCount } = useStore();

  return (
    <div className={styles.actions}>
      <Link href={`/${locale}/favourites`} className={styles.iconButton} aria-label={favoritesLabel}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 20.5s-7-4.5-9.5-9C.6 8 2 4.5 5.3 4.5c2 0 3.4 1 4.7 2.7C11.3 5.5 12.7 4.5 14.7 4.5 18 4.5 19.4 8 17.5 11.5c-2.5 4.5-9.5 9-9.5 9Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        {favoritesCount > 0 && <span className={styles.badge}>{favoritesCount}</span>}
      </Link>

      <Link href={`/${locale}/cart`} className={styles.iconButton} aria-label={cartLabel}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 4h2l1.6 9.6a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 2-1.6L19.5 8H6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9.5" cy="19" r="1.2" fill="currentColor" />
          <circle cx="16.5" cy="19" r="1.2" fill="currentColor" />
        </svg>
        {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
      </Link>
    </div>
  );
}
