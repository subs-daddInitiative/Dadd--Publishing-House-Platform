import { isLocale, type Locale } from "@/i18n/config";
import { getCurrentSubscriber, getPublicBlogCategories } from "@/lib/serverApi";
import { WriterBlogForm } from "@/features/blogEditor/WriterBlogForm";
import { notFound, redirect } from "next/navigation";

export default async function NewWriterBlogPage({
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

  const categories = await getPublicBlogCategories();

  return <WriterBlogForm locale={locale} mode="create" categories={categories} />;
}
