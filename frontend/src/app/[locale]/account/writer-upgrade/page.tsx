import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCurrentSubscriber, getWriterUpgradeStatus } from "@/lib/serverApi";
import { WriterUpgradeView } from "@/features/subscribers/WriterUpgradeView";
import { AccountNav } from "@/features/subscribers/AccountNav";
import { notFound, redirect } from "next/navigation";

export default async function WriterUpgradePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const subscriber = await getCurrentSubscriber();
  if (!subscriber) redirect(`/${locale}/login`);
  if (subscriber.account_type !== "writer") redirect(`/${locale}/account`);

  const [dictionary, upgradeStatus] = await Promise.all([getDictionary(locale), getWriterUpgradeStatus()]);

  return (
    <>
      <AccountNav locale={locale} dictionary={dictionary} subscriber={subscriber} />
      <WriterUpgradeView locale={locale} dictionary={dictionary} subscriber={subscriber} upgradeStatus={upgradeStatus} />
    </>
  );
}
