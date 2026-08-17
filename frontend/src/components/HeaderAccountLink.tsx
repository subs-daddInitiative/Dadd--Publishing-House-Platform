import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Subscriber } from "@/lib/serverApi";
import styles from "./HeaderStoreActions.module.css";

type HeaderAccountLinkProps = {
  locale: Locale;
  subscriber: Subscriber | null;
  loginLabel: string;
  accountLabel: string;
};

export function HeaderAccountLink({ locale, subscriber, loginLabel, accountLabel }: HeaderAccountLinkProps) {
  return (
    <Link
      href={subscriber ? `/${locale}/account` : `/${locale}/login`}
      className={styles.iconButton}
      aria-label={subscriber ? accountLabel : loginLabel}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M4.5 19.5c1.4-3.4 4.4-5.2 7.5-5.2s6.1 1.8 7.5 5.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
