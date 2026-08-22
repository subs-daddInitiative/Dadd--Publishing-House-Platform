import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCurrentSubscriber, getPublicContentAccessPlans } from "@/lib/serverApi";
import { BlogSubscriptionCards } from "@/features/subscribers/BlogSubscriptionCards";
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
    title: `${dictionary.subscribePage.title} | ${dictionary.common.siteName}`,
    description: dictionary.subscribePage.subtitle,
    alternates: {
      canonical: `/${locale}/subscribe`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}/subscribe`])),
    },
  };
}

export default async function SubscribePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const [dictionary, subscriber, plans] = await Promise.all([
    getDictionary(locale),
    getCurrentSubscriber(),
    getPublicContentAccessPlans(),
  ]);

  const blogPlans = plans.filter((plan) => plan.category === "blogs");

  return (
    <BlogSubscriptionCards
      locale={locale}
      dictionary={dictionary}
      isLoggedIn={Boolean(subscriber)}
      blogAccessExpiresAt={subscriber?.blog_access_expires_at ?? null}
      plans={blogPlans}
    />
  );
}
