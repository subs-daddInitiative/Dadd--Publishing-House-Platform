"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, localeLabels, type Locale } from "@/i18n/config";
import styles from "./LanguageSwitcher.module.css";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const restOfPath = segments.slice(1).join("/");

  return (
    <ul className={styles.list}>
      {locales.map((loc) => {
        const href = `/${loc}${restOfPath ? `/${restOfPath}` : ""}`;
        const isActive = loc === locale;
        return (
          <li key={loc}>
            <Link
              href={href}
              className={styles.link}
              aria-current={isActive ? "true" : undefined}
              data-active={isActive}
            >
              {localeLabels[loc]}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
