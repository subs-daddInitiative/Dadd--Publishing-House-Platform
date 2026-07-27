import type { Metadata } from "next";
import type { ReactNode } from "react";
import { locales, localeDirections, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.common.siteName,
    description: dictionary.home.heroSubtitle,
    alternates: {
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}`])),
    },
    openGraph: {
      title: dictionary.common.siteName,
      description: dictionary.home.heroSubtitle,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.common.siteName,
      description: dictionary.home.heroSubtitle,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);
  const dir = localeDirections[locale];

  return (
    <html lang={locale} dir={dir}>
      <body>
        <a href="#main-content" className="skip-link">
          {dictionary.common.skipToContent}
        </a>
        <Header locale={locale} dictionary={dictionary} />
        <main id="main-content">{children}</main>
        <Footer dictionary={dictionary} />
      </body>
    </html>
  );
}
