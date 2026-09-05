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
    title: `${dictionary.privacyPage.title} | ${dictionary.common.siteName}`,
    description: dictionary.privacyPage.intro,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}/privacy`])),
    },
  };
}

export default async function PrivacyPage({
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
      title={dictionary.privacyPage.title}
      updated={dictionary.privacyPage.updated}
      intro={dictionary.privacyPage.intro}
      sections={dictionary.privacyPage.sections}
    />
  );
}
