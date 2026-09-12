import Link from "next/link";
import { getAdminBlogs, getAdminHighlightedBlogsCount, backendAssetUrl } from "@/lib/serverApi";
import { BlogRowActions } from "./BlogRowActions";
import { AdminBlogsFilters } from "./AdminBlogsFilters";
import styles from "./blogs.module.css";

export const metadata = { title: "المدونة" };

const STATUS_LABELS: Record<string, string> = {
  draft: "مسودة",
  published: "منشور",
};

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; premium?: string; highlighted?: string }>;
}) {
  const { search, premium: premiumParam, highlighted: highlightedParam } = await searchParams;
  const premium = premiumParam === "free" || premiumParam === "premium" ? premiumParam : undefined;
  const highlighted = highlightedParam === "1" ? "1" : undefined;
  const [blogs, highlightedCount] = await Promise.all([
    getAdminBlogs({ search, premium, highlighted }),
    getAdminHighlightedBlogsCount(),
  ]);

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>المدونة</h1>
        <div className={styles.actions}>
          <span className={styles.headerStat}>
            <strong>{highlightedCount}</strong> مميزة حاليًا
          </span>
          <Link href="/admin/dashboard/blogs/categories" className={styles.buttonSecondary}>
            إدارة التصنيفات
          </Link>
          <Link href="/admin/dashboard/blogs/new" className={styles.button}>
            إضافة مقالة
          </Link>
        </div>
      </div>

      <AdminBlogsFilters />

      {blogs.length === 0 ? (
        <p className={styles.empty}>لا توجد مقالات بعد.</p>
      ) : (
        <ul className={styles.list}>
          {blogs.map((blog) => {
            const coverImageUrl = backendAssetUrl(blog.cover_image);
            return (
              <li key={blog.id} className={styles.item}>
                {coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverImageUrl} alt={blog.title} className={styles.thumbnail} />
                ) : (
                  <div className={styles.thumbnailFallback} aria-hidden="true">
                    {blog.title.charAt(0)}
                  </div>
                )}

                <div className={styles.itemBody}>
                  <p className={styles.itemTitle}>{blog.title}</p>
                  <p className={styles.itemMeta}>
                    {blog.category_name || "بدون تصنيف"}
                    {" · "}
                    <span
                      className={
                        blog.status === "published" ? styles.statusBadgePublished : styles.statusBadgeDraft
                      }
                    >
                      {STATUS_LABELS[blog.status]}
                    </span>
                    {" · "}
                    <span className={blog.is_premium ? styles.premiumBadge : styles.freeBadge}>
                      {blog.is_premium ? "للمشتركين فقط" : "مجانية"}
                    </span>
                    {Boolean(blog.is_highlighted_active) && (
                      <>
                        {" · "}
                        <span className={styles.highlightBadge}>
                          ⭐ مميزة{blog.highlighted_until ? ` حتى ${blog.highlighted_until}` : ""}
                        </span>
                      </>
                    )}
                    {" · "}
                    {blog.published_at || blog.updated_at}
                  </p>
                </div>

                <BlogRowActions id={blog.id} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
