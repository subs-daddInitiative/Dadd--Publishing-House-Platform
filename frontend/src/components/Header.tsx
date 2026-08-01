import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import styles from "./Header.module.css";

type HeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
  siteName: string;
  logoUrl: string | null;
};

export function Header({ locale, dictionary, siteName, logoUrl }: HeaderProps) {
  const navItems = [
    { href: `/${locale}`, label: dictionary.nav.home },
    { href: `/${locale}/books`, label: dictionary.nav.books },
    { href: `/${locale}/studies`, label: dictionary.nav.studies },
    { href: `/${locale}/blog`, label: dictionary.nav.blog },
    { href: `/${locale}/contact`, label: dictionary.nav.contact },
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href={`/${locale}`} className={styles.siteName}>
          {logoUrl ? (
            <Image src={logoUrl} alt={siteName} width={40} height={40} className={styles.logo} />
          ) : (
            siteName
          )}
        </Link>
        <nav aria-label={dictionary.nav.home}>
          <ul className={styles.nav}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
