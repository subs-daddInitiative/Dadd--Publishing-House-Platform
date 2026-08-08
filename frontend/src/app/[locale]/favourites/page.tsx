import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { FavouritesView } from "@/features/books/FavouritesView";
import { notFound } from "next/navigation";

export default async function FavouritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const dictionary = await getDictionary(locale);

  return <FavouritesView locale={locale} dictionary={dictionary} />;
}
