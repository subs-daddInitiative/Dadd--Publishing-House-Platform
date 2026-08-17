import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCurrentSubscriber } from "@/lib/serverApi";
import { AuthForm } from "@/features/subscribers/AuthForm";
import { notFound, redirect } from "next/navigation";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const subscriber = await getCurrentSubscriber();
  if (subscriber) redirect(`/${locale}/account`);

  const dictionary = await getDictionary(locale);

  return <AuthForm locale={locale} dictionary={dictionary} mode="login" />;
}
