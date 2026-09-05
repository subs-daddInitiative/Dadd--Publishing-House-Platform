import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { LegalPage } from "@/features/legal/LegalPage";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.termsPage.title} | ${dictionary.common.siteName}`,
    description: dictionary.termsPage.intro,
    alternates: {
      canonical: `/${locale}/terms`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}/terms`])),
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const dictionary = await getDictionary(locale);

  return (
    <LegalPage
      title={dictionary.termsPage.title}
      updated={dictionary.termsPage.updated}
      intro={dictionary.termsPage.intro}
      sections={dictionary.termsPage.sections}
    />
  );
}
