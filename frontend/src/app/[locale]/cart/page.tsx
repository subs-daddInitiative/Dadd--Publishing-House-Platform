import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getPublicSettings } from "@/lib/serverApi";
import { CartView } from "@/features/books/CartView";
import { notFound } from "next/navigation";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const [dictionary, settings] = await Promise.all([getDictionary(locale), getPublicSettings()]);

  return <CartView locale={locale} dictionary={dictionary} whatsappNumber={settings?.whatsappNumber ?? null} />;
}
