import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getCurrentSubscriber, getPublicBlogCategories, getWriterBlogById, backendAssetUrl } from "@/lib/serverApi";
import { WriterBlogForm } from "@/features/blogEditor/WriterBlogForm";
import { AccountNav } from "@/features/subscribers/AccountNav";
import { getDictionary } from "@/i18n/getDictionary";
import { notFound, redirect } from "next/navigation";
import styles from "@/features/subscribers/subscribers.module.css";

export default async function EditWriterBlogPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const subscriber = await getCurrentSubscriber();
  if (!subscriber) redirect(`/${locale}/login`);
  if (subscriber.account_type !== "writer") redirect(`/${locale}/account`);

  const [categories, blog] = await Promise.all([getPublicBlogCategories(), getWriterBlogById(id)]);
  if (!blog) notFound();
  if (blog.review_status === "approved") redirect(`/${locale}/account/blogs`);

  const dictionary = await getDictionary(locale);

  const tierExpired = Boolean(subscriber.tier_expires_at && new Date(subscriber.tier_expires_at) < new Date());
  if (subscriber.current_tier === "none" || tierExpired) {
    return (
      <>
        <AccountNav locale={locale} dictionary={dictionary} subscriber={subscriber} />
        <div className={styles.accountPage}>
          <h1 className={styles.accountTitle}>تعديل المقال</h1>
          <div className={styles.accountCard}>
            <p>انتهت باقتك الحالية. يجب الاشتراك في باقة كاتب مفعّلة لتتمكن من تعديل المقالات وإرسالها للمراجعة.</p>
            <Link href={`/${locale}/account`} className={styles.planButton}>
              الذهاب إلى صفحة الاشتراك
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AccountNav locale={locale} dictionary={dictionary} subscriber={subscriber} />
      <WriterBlogForm
        locale={locale}
        mode="edit"
        blogId={blog.id}
        categories={categories}
        initialBlog={blog}
        currentCoverImageUrl={backendAssetUrl(blog.cover_image)}
      />
    </>
  );
}
