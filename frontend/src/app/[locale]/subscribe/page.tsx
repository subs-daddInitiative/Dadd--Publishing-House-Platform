import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import {
  getCurrentSubscriber,
  getPublicContentAccessPlans,
  getPublicContentTrials,
  getPublicBlogCategories,
  getPublicStudyCategories,
} from "@/lib/serverApi";
import { BlogSubscriptionCards } from "@/features/subscribers/BlogSubscriptionCards";
import { ContentTrialsSection } from "@/features/subscribers/ContentTrialsSection";
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

  const [dictionary, subscriber, plans, blogTrials, studyTrials, blogCategories, studyCategories] =
    await Promise.all([
      getDictionary(locale),
      getCurrentSubscriber(),
      getPublicContentAccessPlans(),
      getPublicContentTrials("blogs"),
      getPublicContentTrials("studies"),
      getPublicBlogCategories(locale),
      getPublicStudyCategories(locale),
    ]);

  const blogPlans = plans.filter((plan) => plan.category === "blogs");

  const categoryNames: Record<string, string> = {};
  for (const category of blogCategories) categoryNames[`blogs:${category.id}`] = category.name;
  for (const category of studyCategories) categoryNames[`studies:${category.id}`] = category.name;

  return (
    <>
      <BlogSubscriptionCards
        locale={locale}
        dictionary={dictionary}
        isLoggedIn={Boolean(subscriber)}
        blogAccessExpiresAt={subscriber?.blog_access_expires_at ?? null}
        plans={blogPlans}
      />
      <ContentTrialsSection
        locale={locale}
        isLoggedIn={Boolean(subscriber)}
        trials={blogTrials}
        categoryNames={categoryNames}
        title="تجارب مجانية للمدونة"
        subtitle="جرّب مقالات المدونة المميزة مجانًا لفترة محدودة"
      />
      <ContentTrialsSection
        locale={locale}
        isLoggedIn={Boolean(subscriber)}
        trials={studyTrials}
        categoryNames={categoryNames}
        title="تجارب مجانية للدراسات"
        subtitle="جرّب الدراسات المميزة مجانًا لفترة محدودة"
      />
    </>
  );
}
