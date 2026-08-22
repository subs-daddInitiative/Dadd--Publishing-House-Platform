import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCurrentSubscriber, getPublicSubscriptionPlans, getWriterUpgradeStatus } from "@/lib/serverApi";
import { AccountView } from "@/features/subscribers/AccountView";
import { AccountNav } from "@/features/subscribers/AccountNav";
import { notFound, redirect } from "next/navigation";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const subscriber = await getCurrentSubscriber();
  if (!subscriber) redirect(`/${locale}/login`);

  const [dictionary, plans, upgradeStatus] = await Promise.all([
    getDictionary(locale),
    getPublicSubscriptionPlans(),
    subscriber.account_type === "writer" ? getWriterUpgradeStatus() : Promise.resolve(null),
  ]);

  return (
    <>
      <AccountNav locale={locale} dictionary={dictionary} subscriber={subscriber} />
      <AccountView
        locale={locale}
        dictionary={dictionary}
        subscriber={subscriber}
        plans={plans}
        upgradeStatus={upgradeStatus}
      />
    </>
  );
}
