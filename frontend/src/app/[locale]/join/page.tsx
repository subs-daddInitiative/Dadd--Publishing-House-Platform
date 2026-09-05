import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { JoinForm } from "@/features/join/JoinForm";
import { notFound } from "next/navigation";
import styles from "@/features/join/join.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.joinPage.title} | ${dictionary.common.siteName}`,
    description: dictionary.joinPage.subtitle,
    alternates: {
      canonical: `/${locale}/join`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}/join`])),
    },
  };
}

export default async function JoinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const dictionary = await getDictionary(locale);

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{dictionary.joinPage.title}</h1>
      <p className={styles.subtitle}>{dictionary.joinPage.subtitle}</p>
      <JoinForm locale={locale} dictionary={dictionary} />
    </div>
  );
}
