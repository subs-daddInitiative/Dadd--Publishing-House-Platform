"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Subscriber } from "@/lib/serverApi";
import styles from "./subscribers.module.css";

type AccountNavProps = {
  locale: Locale;
  dictionary: Dictionary;
  subscriber: Subscriber;
};

export function AccountNav({ locale, dictionary, subscriber }: AccountNavProps) {
  const pathname = usePathname();
  const isWriter = subscriber.account_type === "writer";

  const links = [
    { href: `/${locale}/account`, label: dictionary.accountPage.navOverview },
    { href: `/${locale}/account/profile`, label: dictionary.accountPage.navProfile },
    { href: `/${locale}/account/favorites`, label: dictionary.accountPage.navFavorites },
    ...(isWriter ? [{ href: `/${locale}/account/blogs`, label: dictionary.accountPage.myBlogs }] : []),
    ...(isWriter
      ? [{ href: `/${locale}/account/writer-upgrade`, label: dictionary.accountPage.navWriterUpgrade }]
      : []),
  ];

  return (
    <nav className={styles.accountNav} aria-label={dictionary.accountPage.title}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${styles.accountNavLink} ${pathname === link.href ? styles.accountNavLinkActive : ""}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
