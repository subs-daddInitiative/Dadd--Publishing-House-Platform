import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getCurrentSubscriber, getWriterBlogs } from "@/lib/serverApi";
import { notFound, redirect } from "next/navigation";
import styles from "@/features/subscribers/subscribers.module.css";

const REVIEW_LABELS: Record<string, string> = {
  none: "مسودة",
  pending: "قيد المراجعة",
  approved: "منشورة",
  rejected: "مرفوضة",
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

  const blogs = await getWriterBlogs();

  return (
    <div className={styles.accountPage}>
      <div className={styles.accountTitle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>مقالاتي</h1>
        <Link href={`/${locale}/account/blogs/new`} className={styles.planButton}>
          كتابة مقال جديد
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p>لم تكتب أي مقال بعد.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className={styles.accountCard}>
            <p style={{ fontWeight: 600 }}>{blog.title}</p>
            <p className={styles.expiresText}>{REVIEW_LABELS[blog.review_status]}</p>
            {blog.review_status === "rejected" && blog.review_reason && (
              <p className={styles.expiresText}>السبب: {blog.review_reason}</p>
            )}
            {blog.review_status !== "approved" && (
              <Link href={`/${locale}/account/blogs/${blog.id}/edit`}>تعديل</Link>
            )}
          </div>
        ))
      )}
    </div>
  );
}
