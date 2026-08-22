import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCurrentSubscriber, getSubscriberFavorites } from "@/lib/serverApi";
import { AccountFavoritesView } from "@/features/subscribers/AccountFavoritesView";
import { AccountNav } from "@/features/subscribers/AccountNav";
import { notFound, redirect } from "next/navigation";

export default async function AccountFavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const subscriber = await getCurrentSubscriber();
  if (!subscriber) redirect(`/${locale}/login`);

  const [dictionary, favorites] = await Promise.all([getDictionary(locale), getSubscriberFavorites()]);

  return (
    <>
      <AccountNav locale={locale} dictionary={dictionary} subscriber={subscriber} />
      <AccountFavoritesView locale={locale} dictionary={dictionary} blogs={favorites.blogs} studies={favorites.studies} />
    </>
  );
}
