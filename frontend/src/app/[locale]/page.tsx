import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <section className={`container ${styles.hero}`}>
      <h1 className={styles.title}>{dictionary.home.heroTitle}</h1>
      <p className={styles.subtitle}>{dictionary.home.heroSubtitle}</p>
      <div className={styles.actions}>
        <Link href={`/${locale}/books`} className={styles.primaryAction}>
          {dictionary.home.exploreBooks}
        </Link>
        <Link href={`/${locale}/studies`} className={styles.secondaryAction}>
          {dictionary.home.readStudies}
        </Link>
      </div>
    </section>
  );
}
