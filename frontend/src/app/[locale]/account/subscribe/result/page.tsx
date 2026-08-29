import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { SubscribeResultView } from "@/features/subscribers/SubscribeResultView";
import { notFound } from "next/navigation";

export default async function SubscribeResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tap_id?: string; provider?: string; token?: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const { tap_id: tapId, provider, token } = await searchParams;
  const dictionary = await getDictionary(locale);
  const paypalOrderId = provider === "paypal" ? (token ?? null) : null;

  return (
    <SubscribeResultView
      locale={locale}
      dictionary={dictionary}
      tapId={tapId ?? null}
      paypalOrderId={paypalOrderId}
    />
  );
}
