import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getPublicSettings } from "@/lib/serverApi";
import { Contact } from "@/features/home/Contact";
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
    title: `${dictionary.nav.contact} | ${dictionary.common.siteName}`,
    description: dictionary.home.contactIntro,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}/contact`])),
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const [dictionary, settings] = await Promise.all([getDictionary(locale), getPublicSettings()]);

  return (
    <Contact
      dictionary={dictionary}
      callNumber={settings?.callNumber ?? null}
      whatsappNumber={settings?.whatsappNumber ?? null}
      socialLinks={settings?.socialLinks || []}
    />
  );
}
