import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getCurrentSubscriber, getWriterBlogs, backendAssetUrl } from "@/lib/serverApi";
import { AccountNav } from "@/features/subscribers/AccountNav";
import { getDictionary } from "@/i18n/getDictionary";
import { notFound, redirect } from "next/navigation";
import styles from "./writerBlogs.module.css";

const REVIEW_LABELS: Record<string, string> = {
  none: "مسودة",
  pending: "قيد المراجعة",
  approved: "منشورة",
  rejected: "مرفوضة",
};

const REVIEW_BADGE_CLASS: Record<string, string> = {
  none: "badgeDraft",
  pending: "badgePending",
  approved: "badgeApproved",
  rejected: "badgeRejected",
};

export default async function WriterBlogsPage({
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

  const [dictionary, blogs] = await Promise.all([getDictionary(locale), getWriterBlogs()]);

  return (
    <>
    <AccountNav locale={locale} dictionary={dictionary} subscriber={subscriber} />
    <div className={`container ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>مقالاتي</h1>
          <p className={styles.pageSubtitle}>تابع حالة مقالاتك المرسلة وأنشئ مقالات جديدة.</p>
        </div>
        <Link href={`/${locale}/account/blogs/new`} className={styles.newButton}>
          + كتابة مقال جديد
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className={styles.empty}>
          <p>لم تكتب أي مقال بعد.</p>
          <Link href={`/${locale}/account/blogs/new`} className={styles.newButton}>
            ابدأ الآن
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {blogs.map((blog) => {
            const coverUrl = backendAssetUrl(blog.cover_image);
            return (
              <div key={blog.id} className={styles.card}>
                <div className={styles.thumbWrap}>
                  {coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverUrl} alt="" className={styles.thumb} />
                  ) : (
                    <div className={styles.thumbFallback} aria-hidden="true">
                      {blog.title.charAt(0)}
                    </div>
                  )}
                  <span className={`${styles.badge} ${styles[REVIEW_BADGE_CLASS[blog.review_status] ?? ""] || ""}`}>
                    {REVIEW_LABELS[blog.review_status]}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardTitle}>{blog.title}</p>
                  {blog.review_status === "rejected" && blog.review_reason && (
                    <p className={styles.rejectReason}>السبب: {blog.review_reason}</p>
                  )}
                  {blog.review_status !== "approved" && (
                    <Link href={`/${locale}/account/blogs/${blog.id}/edit`} className={styles.editLink}>
                      تعديل
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
}
