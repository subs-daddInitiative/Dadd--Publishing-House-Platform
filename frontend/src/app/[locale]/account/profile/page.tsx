import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCurrentSubscriber, backendAssetUrl } from "@/lib/serverApi";
import { ProfileView } from "@/features/subscribers/ProfileView";
import { AccountNav } from "@/features/subscribers/AccountNav";
import { notFound, redirect } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const subscriber = await getCurrentSubscriber();
  if (!subscriber) redirect(`/${locale}/login`);

  const dictionary = await getDictionary(locale);
  const profileImageUrl = backendAssetUrl(subscriber.profile_image);

  return (
    <>
      <AccountNav locale={locale} dictionary={dictionary} subscriber={subscriber} />
      <ProfileView dictionary={dictionary} subscriber={subscriber} profileImageUrl={profileImageUrl} />
    </>
  );
}
